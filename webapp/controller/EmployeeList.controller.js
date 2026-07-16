sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../service/EmployeeService",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (BaseController, formatter, MessageBox, Sorter, Filter, FilterOperator, EmployeeService, Fragment, JSONModel) {
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
			this.getOwnerComponent().updateDashboardCounts();
			oModel.refresh(true);
			this.showToast("Data Cleared");
		},

		// click on employee card
		onEmployeePress: function (oEvent) {
      var oEmployee = oEvent.getSource().getBindingContext().getObject();
      this._openEmployeeDialog(oEmployee);
    },

    //open dialog
    _openEmployeeDialog: function (oEmployee) {
			var oView = this.getView();
			if (!this._pEmployeeDialog) {
				this._pEmployeeDialog = Fragment.load({
						id: oView.getId(),
						name: "com.example.employeeapp.employeeapp.fragments.EmployeeDetailsDialog",
						controller: this
				}).then(function (oDialog) {
				oView.addDependent(oDialog);
				return oDialog;
				});
			}
			this._pEmployeeDialog.then(function (oDialog) {
				var oModel = new JSONModel(oEmployee);
				oDialog.setModel(oModel, "selectedEmployee");
				oDialog.open();
			});
		},

		// close dialog
		onCloseEmployeeDialog: function () {
    	this.byId("employeeDetailsDialog").close();
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
    	this.showToast("Sorted A-Z");
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
    	this.showToast("Sorted Z-A");
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
		this.showToast("Employees exported successfully");
    	}
		},
  });
});