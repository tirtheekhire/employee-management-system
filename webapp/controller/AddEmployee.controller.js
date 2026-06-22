sap.ui.define([
  "./BaseController",
  "sap/ui/core/UIComponent",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "../util/Validation",
  "../service/EmployeeService"
], function (BaseController, UIComponent, MessageToast, MessageBox, Validation, EmployeeService) {
  "use strict";
  return BaseController.extend("com.example.employeeapp.employeeapp.controller.AddEmployee", {

    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("addEmployee").attachPatternMatched(this._onAddMode,this);
      oRouter.getRoute("editEmployee").attachPatternMatched(this._onEditMode,this);
    },

    //reset input fields
    _onRouteMatched: function () {
      this.byId("nameInput").setValue("");
      this.byId("roleInput").setValue("");
      this.byId("nameInput").setValueState("None");
      this.byId("roleInput").setValueState("None");
      // this.byId("statusSelect").setSelectedKey(""); // Reset status
    },

    // for add functionality
    _onAddMode: function () {
      this._isEditMode = false;
      this._employeeId = null;
      this.byId("employeePage").setTitle("Add Employee");
      this.byId("saveBtn").setText("Save Employee");
      this.byId("nameInput").setValue("");
      this.byId("roleInput").setValue("");
      // Reset status dropdown
      this.byId("statusSelect").setSelectedKey("");
      this.byId("nameInput").setValueState("None");
      this.byId("roleInput").setValueState("None");
    },

    // for edit functionality
    _onEditMode: function (oEvent) {
      this._isEditMode = true;
      var sId = oEvent.getParameter("arguments").employeeId;
      var oModel = this.getView().getModel();
      var aEmployees = oModel.getProperty("/employees");
      var oEmployee = aEmployees.find(emp => emp.id == sId);
      this._employeeId = sId;
      this.byId("employeePage").setTitle("Edit Employee");
      this.byId("saveBtn").setText("Update Employee");
      this.byId("nameInput").setValue(oEmployee.name);
      this.byId("roleInput").setValue(oEmployee.role);
      this.byId("statusSelect").setSelectedKey(oEmployee.status || "");
      this.byId("saveBtn").setText("Update Employee");
    },

    // back button
    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("employeeList");
    },
    
    // edit/update employee
    onSaveEmployee: function () {
      var oModel = this.getModel();
      var oNameInput = this.byId("nameInput");
      var sName = this.capitalizeWords(oNameInput.getValue().trim());
      var oRoleInput = this.byId("roleInput");
      var sRole = this.capitalizeWords(oRoleInput.getValue().trim());
      var oEmployee = {
        id: this._isEditMode ? this._employeeId : Date.now(),
        name: sName,
        role: sRole,
        status: this.byId("statusSelect").getSelectedKey()
      };
      if (!Validation.validateEmployeeForm(this)) {
        return;
      }
      if (this._isEditMode) {
        EmployeeService.updateEmployee(oModel, oEmployee);
        this.showToast("Employee updated successfully");
      } else {
        EmployeeService.addEmployee(oModel, oEmployee);
        this.showToast("Employee added successfully");
      }
      this.updateCounts();
      this.getOwnerComponent().getRouter().navTo("employeeList");
    },

    onFieldChange: function (oEvent) {
      oEvent.getSource().setValueState("None");
    },

    capitalizeWords: function (sText) {
      return sText
        .toLowerCase()
        .split(" ")
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
  });
});