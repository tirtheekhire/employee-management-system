sap.ui.define([
	"sap/ui/core/UIComponent",
	"com/example/employeeapp/employeeapp/model/models"
], (UIComponent, models) => {
  "use strict";
  return UIComponent.extend("com.example.employeeapp.employeeapp.Component", {
		metadata: {
			manifest: "json",
			interfaces: [
				"sap.ui.core.IAsyncContentCreation"
			]
		},

		init() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// local json data
			var oData = {
				employees: [
					{ id: 1, name: "Rahul", role: "Manager" },
					{ id: 2, name: "Anita", role: "HR" }
				]
			};
			// var oModel = new sap.ui.model.json.JSONModel( oData);
			var aEmployees = JSON.parse(localStorage.getItem("employees")) || [];
			var oModel = new sap.ui.model.json.JSONModel({
    		employees: aEmployees,
    		employeeCount: aEmployees.length
			});
			this.setModel(oModel);
			// enable routing
			this.getRouter().initialize();
		}
  });
});