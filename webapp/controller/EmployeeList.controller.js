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
			this.updateCounts();
			oModel.refresh(true);
			this.showToast("Data Cleared");
		},

		onLoadDemoData: function () {
			var oModel = this.getView().getModel();
			var aDemoEmployees = [
				{
					EmployeeId: "EMP001",
					Name: "Alice Johnson",
					Email: "alice.johnson@example.com",
					Mobile: "9876543210",
					Gender: "Female",
					DateOfBirth: "1990-05-12",
					Department: "Human Resources",
					Role: "HR Manager",
					EmploymentType: "Full-Time",
					Status: "Active",
					JoiningDate: "2018-09-01",
					Manager: "David Lee",
					Address1: "123 Maple Street",
					Address2: "",
					City: "Seattle",
					State: "WA",
					Country: "USA",
					Pincode: "98101",
					Experience: "6",
					Salary: "85000",
					Education: "MBA",
					Skills: "Recruitment, Employee Relations",
					EmergencyContact: "Michael Johnson",
					EmergencyPhone: "9876501234",
					BloodGroup: "A+",
					Notes: "Top performer"
				},
				{
					EmployeeId: "EMP002",
					Name: "Brian Patel",
					Email: "brian.patel@example.com",
					Mobile: "9765432101",
					Gender: "Male",
					DateOfBirth: "1988-11-20",
					Department: "Finance",
					Role: "Finance Analyst",
					EmploymentType: "Full-Time",
					Status: "Active",
					JoiningDate: "2019-03-15",
					Manager: "Samantha Green",
					Address1: "450 Harbor Drive",
					Address2: "Apt 22B",
					City: "San Francisco",
					State: "CA",
					Country: "USA",
					Pincode: "94105",
					Experience: "5",
					Salary: "92000",
					Education: "B.Com",
					Skills: "Budgeting, Reporting",
					EmergencyContact: "Meera Patel",
					EmergencyPhone: "9765401234",
					BloodGroup: "B+",
					Notes: "Certified CPA"
				},
				{
					EmployeeId: "EMP003",
					Name: "Carlos Garcia",
					Email: "carlos.garcia@example.com",
					Mobile: "9654321098",
					Gender: "Male",
					DateOfBirth: "1992-08-03",
					Department: "Engineering",
					Role: "Software Engineer",
					EmploymentType: "Full-Time",
					Status: "On Leave",
					JoiningDate: "2021-01-10",
					Manager: "Angela Martin",
					Address1: "89 Elm Street",
					Address2: "",
					City: "Austin",
					State: "TX",
					Country: "USA",
					Pincode: "73301",
					Experience: "3",
					Salary: "78000",
					Education: "B.Tech",
					Skills: "JavaScript, UI5",
					EmergencyContact: "Isabel Garcia",
					EmergencyPhone: "9654321000",
					BloodGroup: "O+",
					Notes: "Working on portal redesign"
				},
				{
					EmployeeId: "EMP004",
					Name: "Diana Smith",
					Email: "diana.smith@example.com",
					Mobile: "9543210987",
					Gender: "Female",
					DateOfBirth: "1995-04-27",
					Department: "Sales",
					Role: "Sales Executive",
					EmploymentType: "Contract",
					Status: "Inactive",
					JoiningDate: "2020-06-22",
					Manager: "Oliver Brown",
					Address1: "210 Oak Avenue",
					Address2: "Suite 3",
					City: "Chicago",
					State: "IL",
					Country: "USA",
					Pincode: "60601",
					Experience: "4",
					Salary: "67000",
					Education: "BBA",
					Skills: "Client Relations, Negotiation",
					EmergencyContact: "Michelle Smith",
					EmergencyPhone: "9543201234",
					BloodGroup: "AB+",
					Notes: "Available after contract ends"
				}
			];
			EmployeeService.setEmployees(oModel, aDemoEmployees);
			this._updateRoles(aDemoEmployees);
			this.updateCounts();
			oModel.refresh(true);
			this.showToast("Demo data loaded successfully");
		},

		_updateRoles: function (aEmployees) {
			var oModel = this.getView().getModel();
			var aRoles = ["ALL"];
			aEmployees.forEach(function (employee) {
				if (!aRoles.includes(employee.Role)) {
					aRoles.push(employee.Role);
				}
			});
			oModel.setProperty("/roles", aRoles);
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