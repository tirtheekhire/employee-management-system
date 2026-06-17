sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (Controller, formatter, MessageBox, MessageToast, Sorter, Filter, FilterOperator) {
  "use strict";
  return Controller.extend("com.example.employeeapp.employeeapp.controller.EmployeeList",
  {
		formatter: formatter,
		// on click add employee button
		onAddEmployee: function () {
			this.getOwnerComponent().getRouter().navTo("addEmployee");
		},

		// search functionality
    onSearchEmployee: function (oEvent) {
    	var sValue = oEvent.getParameter("newValue");
      var oList = this.byId("employeeList");
      var oBinding = oList.getBinding("items");
      if (!sValue) {
				oBinding.filter([]);
				 oList.setNoDataText("No employees found");
				return;
		}else  oList.setNoDataText("No matching employees found");
      var aFilters = [new Filter("name",FilterOperator.Contains,sValue)];
      oBinding.filter(aFilters);
    },

		// delete functionality
    onDeleteEmployee: function (oEvent) {
    	var oContext = oEvent.getSource().getBindingContext();
    	var oEmployee = oContext.getObject();
    	MessageBox.confirm("Delete employee '" + oEmployee.name + "' ?",
      {
        title: "Confirm Delete",
        onClose: function (sAction) {
          if (sAction === MessageBox.Action.OK) {
            var oModel = this.getView().getModel();
            var aEmployees = oModel.getProperty("/employees");
						var iIndex = aEmployees.findIndex(emp => emp.id === oEmployee.id);
            if (iIndex > -1) {
							aEmployees.splice(iIndex, 1);
							oModel.setProperty("/employees", aEmployees);
							this.getOwnerComponent().updateRoles();
							this.getOwnerComponent().updateDashboardCounts();
							localStorage.setItem("employees",JSON.stringify(aEmployees));
							oModel.setProperty("/employeeCount", aEmployees.length);
							MessageToast.show("Employee deleted successfully");
						}
          }
        }.bind(this)
      });
		},

		// edit functionality
    onEditEmployee: function (oEvent) {
    	var oEmployee = oEvent.getSource().getBindingContext().getObject();
    	this.getOwnerComponent().getRouter().navTo("editEmployee", {employeeId: oEmployee.id});
		},

		// reset data
		onResetData: function () {
			localStorage.removeItem("employees");
			var oModel = this.getView().getModel();
			oModel.setProperty("/employees", []);
			oModel.setProperty("/employeeCount", 0);
			MessageToast.show("Data Cleared");
		},

		// click on employee card
		onEmployeePress: function (oEvent) {
    	var oEmployee =
        oEvent.getSource()
        .getBindingContext()
        .getObject();
      this.getOwnerComponent()
        .getRouter()
        .navTo("employeeDetails", {
          employeeId: oEmployee.id
        });
		},

		// sorting method Ascending order
		onSortAscending: function () {
    	var oList = this.byId("employeeList");
    	var oBinding = oList.getBinding("items");
    	var oSorter = new Sorter(
        "name",
        false
    	);
    	oBinding.sort(oSorter);
    	MessageToast.show("Sorted A-Z");
		},

		// sorting method Descending order
		onSortDescending: function () {
    	var oList = this.byId("employeeList");
    	var oBinding = oList.getBinding("items");
    	var oSorter = new Sorter(
        "name",
        true
    	);
    	oBinding.sort(oSorter);
    	MessageToast.show("Sorted Z-A");
		},

		// filter function
		onRoleFilter: function (oEvent) {
    	var sRole = oEvent.getSource().getSelectedKey();
    	var oList = this.byId("employeeList");
    	var oBinding = oList.getBinding("items");
    	if (sRole === "ALL") {
        oBinding.filter([]);
        return;
    	}
    	var oFilter = new Filter(
        "role",
        FilterOperator.EQ,
        sRole
    	);
    	oBinding.filter([oFilter]);
		},

		onAfterRendering: function () {
    	var oModel = this.getView().getModel();
    	var oSelect = this.byId("roleFilter");
		},

		//export csv
		onExportCSV: function () {
    	const oModel = this.getView().getModel();
    	const aEmployees = oModel.getProperty("/employees");
    	let csvContent = "Name,Role,Status\n";
    	aEmployees.forEach(function (emp) {
        csvContent += `"${emp.name}","${emp.role}","${emp.status}"\n`;
    	});
    	const blob = new Blob([csvContent],{ type: "text/csv;charset=utf-8;" });
    	const link = document.createElement("a");
    	if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download","employees.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
				MessageToast.show("Employees exported successfully");
    	}
		},
  });
});