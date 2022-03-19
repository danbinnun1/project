import { MessageTypes } from "@open-wa/wa-automate";
import { Flow, registerFlow } from "..";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data) => {
  console.log('skjfg');
  console.log('poiuytrewq');
  const { choice } = await askBoolean(ask, "בטוח שתרצה לבדוק?");
  console.log('uysdf');
  if (choice) {
    const { text } = await ask(
      "מה שמך ידידי הטוב?",
      MessageTypes.TEXT,
      undefined,
      undefined,
      ["משה", "חיים", "שמואל"],
      "יפה",
      "קצת פחות"
    );

    await send(`${text} נשמע כמו שם של חנונים`);
  } else {
    await send("אשפוז", false, { message: "secret message" });
  }
};

export default flow;

// registerFlow(
//   {
//     memberOnly: false,
//     privateOnly: false,
//     identifier: "פינג",
//     description: "פקודת בדיקה",
//     name: "בדיקה",
//   },
//   flow
// );