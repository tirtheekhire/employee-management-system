sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";
  return Controller.extend("com.example.employeeapp.employeeapp.controller.EmployeeDetails",
  {
    onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("employeeDetails").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var sEmployeeId = oEvent.getParameter("arguments").employeeId;
    	var oModel = this.getView().getModel();
    	var aEmployees = oModel.getProperty("/employees");
    	var oEmployee =
        aEmployees.find(
            emp => emp.id == sEmployeeId
        );
	    if (oEmployee) {
        oEmployee.initials = oEmployee.name.charAt(0).toUpperCase();
        oModel.setProperty(
            "/selectedEmployee",
            oEmployee
        );
    	}
		},

    onNavBack: function () {
			this.getOwnerComponent().getRouter().navTo("employeeList");
	  },

		onEditEmployee: function () {
			this.getOwnerComponent().getRouter()
        .navTo("editEmployee", {
            employeeId: this.getView()
              .getModel()
              .getProperty("/selectedEmployee/id")
        });
		}
	});
});