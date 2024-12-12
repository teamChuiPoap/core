import UssdMenu from "ussd-builder";
import { User } from "../models/User";
import { AlertUnreg } from "../models/alertMessage";
import moment from "moment";
import { info } from "../info";

export const menu = new UssdMenu();

let name: string, id_number: string, PIN: string, phoneNumber: string;

try {
  menu.startState({
    run: () => {
      menu.con(
        "welcome to maisha. Select option:" +
          "\n1. Register" +
          "\n2. Due Date Reminder" +
          "\n3. Check Up Reminder" +
          "\n4. Nutritional Information" +
          "\n5. Fetal Development Information" +
          "\n6. Get My Info"
      );
      console.log(menu.val);
    },
    next: {
      "1": "Register",
      "2": "Due Date Reminder",
      "3": "Check Up Reminder",
      "4": "Nutritional Information",
      "5": "Fetal Development Information",
      "6": "Get My Info",
    },
  });

  menu.state("Due Date Reminder", {
    run: async () => {
      //fetch due date from db
      let user = await User.findOne({ phoneNumber: menu.args.phoneNumber });
      if (!user) {
        return menu.end("Please register to the service");
      }
      let due_date = user?.estimated_delivery;

      return menu.end("Your estimated day of delivery is " + due_date);
    },
  });
  menu.state("Check Up Reminder", {
    run: async () => {
      //fetch due date from db
      let user = await User.findOne({ phoneNumber: menu.args.phoneNumber });

      if (!user) {
        return menu.end("User is not registered. Please register");
      }
      let checkup_dates = user?.checkup_dates;
      //calculate the month we're in now from conception
      //give date in that position of the array
      // Determine the closest checkup date index
      // Assuming checkup dates are calculated at conception and stored in order
      const monthsSinceConception = moment().diff(
        moment(user?.date_of_conception),
        "months"
      );
      let checkupIndex = Math.min(
        Math.max(0, Math.floor(monthsSinceConception)),
        user.checkup_dates.length - 1
      );
      user.checkup_dates[checkupIndex];
      return menu.end(
        "Your next checkup date is on " + checkup_dates[checkupIndex]
      );
    },
  });
  menu.state("Nutritional Information", {
    run: async () => {
      //fetch due date from db
      let user = await User.findOne({ phoneNumber: menu.args.phoneNumber });

      if (user) {
        //calculate the month we're in now from conception
        // Calculate months since conception
        const monthsSinceConception = moment().diff(
          moment(user?.date_of_conception),
          "months"
        );
        // Determine the closest checkup date index
        // Assuming checkup dates are calculated at conception and stored in order
        let checkupIndex = Math.min(
          Math.max(0, Math.floor(monthsSinceConception)),
          user.checkup_dates.length - 1
        );
        //give info in that position of the array
        let suitableInfo = info[checkupIndex].nutritional_info;
        return menu.end(suitableInfo);
      } else {
        return menu.end("User not registered. Please register");
      }
    },
  });
  menu.state("Fetal Development Information", {
    run: async () => {
      //fetch due date from db
      let user = await User.findOne({ phoneNumber: menu.args.phoneNumber });

      //calculate the month we're in now from conception
      //give info in that position of the array
      if (user) {
        //calculate the month we're in now from conception
        // Calculate months since conception
        const monthsSinceConception = moment().diff(
          moment(user?.date_of_conception),
          "months"
        );
        // Determine the closest checkup date index
        // Assuming checkup dates are calculated at conception and stored in order
        let checkupIndex = Math.min(
          Math.max(0, Math.floor(monthsSinceConception)),
          user.checkup_dates.length - 1
        );
        //give info in that position of the array
        let suitableInfo = info[checkupIndex].fetal_development;
        return menu.end(suitableInfo);
      } else {
        return menu.end("User not registered. Please register");
      }
    },
  });
  menu.state("Get My Info", {
    run: async () => {
      let user = await User.findOne(
        { phoneNumber: menu.args.phoneNumber },
        { passwprd: 0, _id: 0 }
      );
      return menu.end(JSON.stringify(user));
    },
  });
  /* 
  menu.state("Record Emergency Details", {
    run: async () => {
      let msg = menu.args.text;
      let user = await User.findOne({ phoneNumber: menu.args.phoneNumber });

      if (user) {
        user.alert_messages.push(msg);
        return menu.end(
          "Your alert has been received and is being attended to! A doctor will soon get in touch with you!"
        );
      } else {
        //create log of messages from unregistered users
        let alert = AlertUnreg.create({
          phoneNumber: menu.args.phoneNumber,
          msg: menu.args.text,
        });
        return menu.end(
          "Your alert has been received and is being attended to! A doctor will soon get in touch with you!"
        );
      }
    },
  }); */

  menu.state("Register", {
    run: async () => {
      menu.con("Enter full name");
      if (await User.exists({ phoneNumber: phoneNumber })) {
        return menu.end("Phone Number is already registered to service");
      }
    },
    defaultNext: "EnterIdNumber",
  });

  menu.state("EnterIdNumber", {
    run: () => {
      menu.con("Enter id number");
      name = menu.val;
    },
    defaultNext: "EnterDateofConception",
  });

  menu.state("EnterDateofConception", {
    run: async () => {
      menu.con("Enter estimated Date of Conception in YYYY/MM/DD format");
      id_number = menu.val;
    },
    defaultNext: "Registration Logic",
  });

  menu.state("Registration Logic", {
    run: async () => {
      let date_of_conception = menu.val;
      date_of_conception = moment(date_of_conception, "YYYY/MM/DD")
        .toDate()
        .toDateString();

      //create checkup dates
      // Calculate 9 checkup dates, one month apart
      const checkupDates = [];
      const conceptionMoment = moment(date_of_conception);

      for (let i = 0; i < 10; i++) {
        checkupDates.push(conceptionMoment.clone().add(i, "months").toDate());
      }
      console.log(checkupDates);

      phoneNumber = menu.args.phoneNumber;

      let user: any = await User.create({
        name,
        id_number,
        phoneNumber,
        date_of_conception,
        estimated_delivery: checkupDates[9],
        checkup_dates: checkupDates,
      });

      console.log(user);

      return menu.end("Success!");
    },
  });

  menu.state("end", {
    run: () => {
      return menu.end("Success!");
    },
  });
} catch (err) {
  console.log(err);
}
