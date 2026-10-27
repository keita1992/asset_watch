import { NextApiRequest, NextApiResponse } from 'next';

import { getUser, listAssets } from '@/graphql/queries';
import { client as API } from '@/libs/amplify';
import { USER_ID } from '@/utils/constants';
import { latestUpdatedAt } from '@/utils/lastUpdated';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [userResponse, firstPage] = await Promise.all([
      API.graphql({ query: getUser, variables: { id: USER_ID } }),
      API.graphql({ query: listAssets, variables: { filter: { userId: { eq: USER_ID } } } }),
    ]);
    const user = userResponse.data.getUser;
    if (!user) throw new Error('User not found');

    // 削除も更新として扱うため、論理削除された資産も含め、全ページを確認する。
    let page = firstPage.data.listAssets;
    let latest = latestUpdatedAt([user.updatedAt]);
    while (page) {
      latest = latestUpdatedAt([latest, ...page.items.map((asset) => asset?.updatedAt)]);
      if (!page.nextToken) break;
      const response = await API.graphql({
        query: listAssets,
        variables: { filter: { userId: { eq: USER_ID } }, nextToken: page.nextToken },
      });
      page = response.data.listAssets;
    }
    if (!page) throw new Error('Assets not found');

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ lastUpdatedAt: latest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to read last updated time' });
  }
}
