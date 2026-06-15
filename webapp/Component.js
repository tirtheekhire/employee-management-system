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
			// var oData = {
			// 	employees: [
			// 		{ id: 1, name: "Rahul", role: "Manager" },
			// 		{ id: 2, name: "Anita", role: "HR" }
			// 	]
			// };
			// var oModel = new sap.ui.model.json.JSONModel( oData);
			var aEmployees = JSON.parse(localStorage.getItem("employees")) || [];
			var aRoles = ["ALL"];
			aEmployees.forEach(function (employee) {
    			if (!aRoles.includes(employee.role)) {
        			aRoles.push(employee.role);
    			}
			});
			var oModel = new sap.ui.model.json.JSONModel({
    			employees: aEmployees,
    			employeeCount: aEmployees.length,
					roles: aRoles
			});
			this.setModel(oModel);
			// enable routing
			this.getRouter().initialize();
		},

		//update role function
		updateRoles: function () {
    	var oModel = this.getModel();
    	var aEmployees = oModel.getProperty("/employees");
    	var aRoles = [{
        key: "ALL",
        text: "All Roles"
    	}];
    	aEmployees.forEach(function(employee) {
        var bExists = aRoles.some(function(role) {
          return role.key === employee.role;
        });
        if (!bExists) {
          aRoles.push({
            key: employee.role,
            text: employee.role
          });
        }
    	});
	    oModel.setProperty("/roles", aRoles);
    	oModel.refresh(true);
		},
  });
});