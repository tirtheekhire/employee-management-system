sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../service/EmployeeService"
], function (BaseController, formatter, MessageBox, MessageToast, Sorter, Filter, FilterOperator, EmployeeService) {
  "use strict";
  return BaseController.extend("com.example.employeeapp.employeeapp.controller.EmployeeList",
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
			} else  oList.setNoDataText("No matching employees found");
      var aFilters = [new Filter("Name",FilterOperator.Contains,sValue)];
      oBinding.filter(aFilters);
    },

		// delete functionality
		onDeleteEmployee: function (oEvent) {
    	var oEmployee = oEvent.getSource().getBindingContext().getObject();
			var oModel = this.getView().getModel();
    	MessageBox.confirm(
        "Delete employee '" + oEmployee.Name + "' ?",
        {
          title: "Confirm Delete",
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.OK) {
              EmployeeService.deleteEmployee(oModel, oEmployee.EmployeeId);
              this.updateCounts();
              this.showToast("Employee deleted successfully");
            }
          }.bind(this)
        }
    	);
		},

		// edit functionality
    onEditEmployee: function (oEvent) {
    	var oEmployee = oEvent.getSource().getBindingContext().getObject();
    	this.getOwnerComponent().getRouter().navTo("editEmployee", {employeeId: oEmployee.EmployeeId});
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
    	var oEmployee = oEvent.getSource().getBindingContext().getObject();
			var oDialogModel = new sap.ui.model.json.JSONModel(oEmployee);
    	this.getView().setModel(oDialogModel, "dialog");
			this.byId("employeeDialog").open();
		},

		// close dialog
		onCloseEmployeeDialog: function () {
    	this.byId("employeeDialog").close();
		},

		// edit from dialog
		onDialogEdit: function () {
    	var oEmployee = this.getView().getModel("dialog").getData();
    	this.byId("employeeDialog").close();
    	this.getOwnerComponent().getRouter().navTo("editEmployee", {employeeId: oEmployee.id});
		},

		// sorting method Ascending order
		onSortAscending: function () {
    	var oList = this.byId("employeeList");
    	var oBinding = oList.getBinding("items");
    	var oSorter = new Sorter(
        "Name",
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
        "Name",
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
    	let csvContent = "EmployeeId,Name,Email,Mobile,Gender,DOB,Department,Role,EmploymentType,Status,DOJ,Manager,Address1,Address2,City,State,Country,Pincode,Experience,Salary,Education,Skills,EmergencyContact,EmergencyPhone,BloodGroup,Notes\n";
    	aEmployees.forEach(function (emp) {
        csvContent += `"${emp.EmployeeId}","${emp.Name}","${emp.Email}","${emp.Mobile}","${emp.Gender}","${emp.DateOfBirth}","${emp.Department}","${emp.Role}","${emp.EmploymentType}","${emp.Status}","${emp.JoiningDate}","${emp.Manager}","${emp.Address1}","${emp.Address2}","${emp.City}","${emp.State}","${emp.Country}","${emp.Pincode}","${emp.Experience}","${emp.Salary}","${emp.Education}","${emp.Skills}","${emp.EmergencyContact}","${emp.EmergencyPhone}","${emp.BloodGroup}","${emp.Notes}"\n`;
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