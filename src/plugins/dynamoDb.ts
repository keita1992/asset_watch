import { updateAsset } from "@/graphql/mutations";
import { getUser, listAssets } from "@/graphql/queries";
import { client as API } from "@/libs/amplify";
import { USER_ID } from "@/utils/constants";

export const updateJpyCash = async () => {
  const assetsWithoutJpyCash = await API.graphql({
    query: listAssets,
    variables: {
      filter: {
        and: [
          { userId: { eq: USER_ID } },
          { deletedAt: { attributeExists: false } },
          {
            or: [{ category: { ne: "現金" } }, { currency: { ne: "JPY" } }],
          },
        ],
      },
    },
  }).then((res) => res.data.listAssets.items);

  const jpyCash = await API.graphql({
    query: listAssets,
    variables: {
      filter: {
        userId: { eq: USER_ID },
        category: { eq: "現金" },
        currency: { eq: "JPY" },
        deletedAt: { attributeExists: false },
      },
    },
  }).then((res) => res.data.listAssets.items[0]);

  const user = await API.graphql({
    query: getUser,
    variables: {
      id: USER_ID,
    },
  }).then((res) => res.data.getUser);

  const jpyCashAmount =
    (user?.netAssets ?? 0) -
    (user?.liabilities ?? 0) -
    assetsWithoutJpyCash.reduce((acc, cur) => acc + cur.amount, 0);

  await API.graphql({
    query: updateAsset,
    variables: {
      input: {
        id: jpyCash.id,
        amount: jpyCashAmount,
      },
    },
  }).then((res) => res.data.updateAsset);
};
