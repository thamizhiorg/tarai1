// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.any(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    category: i.entity({
      image: i.string(),
      parentid: i.string(),
      title: i.string(),
    }),
    db: i.entity({}),
    inventory: i.entity({
      available: i.number(),
      committed: i.number(),
      cost: i.number(),
      dtime: i.number(),
      f1: i.string(),
      fulfillment: i.string(),
      location: i.string(),
      modifiers: i.string(),
      name: i.string(),
      qty: i.number(),
      rlevel: i.number(),
      sellprice: i.number(),
      sku: i.string(),
      status: i.string(),
      stock: i.number(),
      unavailable: i.number(),
      vname: i.string(),
      weight: i.number(),
    }),
    messages: i.entity({
      createdAt: i.string(),
      text: i.string(),
    }),
    ondevice: i.entity({
      agent: i.string(),
      pageid: i.string(),
      title: i.string(),
    }),
    settings: i.entity({
      dbid: i.string(),
      dbtoken: i.string(),
      dburl: i.any(),
      workspace: i.string(),
    }),
    stores: i.entity({
      name: i.string(),
    }),
  },
  links: {
    categoryInventory: {
      forward: {
        on: "category",
        has: "many",
        label: "inventory",
      },
      reverse: {
        on: "inventory",
        has: "many",
        label: "category",
      },
    },
    inventoryStore: {
      forward: {
        on: "inventory",
        has: "many",
        label: "store",
      },
      reverse: {
        on: "stores",
        has: "many",
        label: "inventory",
      },
    },
    settings$users: {
      forward: {
        on: "settings",
        has: "one",
        label: "$users",
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "settings",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
