sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function (Controller, MessageToast) {
  "use strict";
  return Controller.extend("com.example.employeeapp.employeeapp.controller.BaseController",
  {
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		showToast: function (sMessage) {
			MessageToast.show(sMessage);
		},
		updateCounts: function () {
			this.getOwnerComponent().updateRoles();
			this.getOwnerComponent().updateDashboardCounts();
			var oModel = this.getModel();
			oModel.setProperty("/employeeCount", oModel.getProperty("/employees").length);
		}
  });
});