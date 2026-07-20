sap.ui.define([], function () {
  "use strict";
  return {
		getStatusState: function (sStatus) {
			switch (sStatus) {
				case "Active":
					return "Success";
				case "Inactive":
					return "Error";
				case "On Leave":
					return "Warning";
				default:
					return "None";
			}
		},
		getStatusIcon: function (sStatus) {
			switch (sStatus) {
				case "Active":
					return "sap-icon://accept";
				case "Inactive":
					return "sap-icon://decline";
				case "On Leave":
					return "sap-icon://lateness";
				default:
					return "sap-icon://question-mark";
			}
    }
  };
});