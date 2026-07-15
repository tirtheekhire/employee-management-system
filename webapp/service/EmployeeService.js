sap.ui.define([], function () {
  "use strict";
  return {
		getEmployees: function (oModel) {
			return oModel.getProperty("/employees") || [];
		},
		_saveEmployees: function (oModel, aEmployees) {
			oModel.setProperty("/employees", aEmployees);
			localStorage.setItem("employees", JSON.stringify(aEmployees));
		},
		addEmployee: function (oModel, oEmployee) {
			const aEmployees = this.getEmployees(oModel);
			aEmployees.push(oEmployee);
			this._saveEmployees(oModel, aEmployees);
		},
    updateEmployee: function (oModel, oUpdatedEmployee) {
			const aEmployees = this.getEmployees(oModel);
			const iIndex = aEmployees.findIndex(emp => String(emp.EmployeeId) === String(oUpdatedEmployee.EmployeeId));
      if (iIndex > -1) {
        aEmployees[iIndex] = oUpdatedEmployee;
        this._saveEmployees(oModel, aEmployees);
      }
    },
    deleteEmployee: function (oModel, sEmployeeId) {
      const aEmployees = this.getEmployees(oModel);
      const aFilteredEmployees = aEmployees.filter(emp => emp.EmployeeId !== sEmployeeId);
      this._saveEmployees(oModel, aFilteredEmployees);
    }
  };
});