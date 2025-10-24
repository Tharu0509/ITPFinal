const Salary = require("../Model/salarymodel");

const getAllSalary = async (req, res, next) => {
  let salary;

  try {
    salary = await Salary.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!Salary) {
    return res.status(404).json({ message: "salary not found" });
  }
  //Display all users
  return res.status(200).json({ salary: salary }); // 🔄 plural key
};

//data Insert
const addSalary = async (req, res, next) => {
  const {
    EmployeeID,
    Attendance,
    BasicSalary,
    Hours,
    Netsalary,
    paymentstatus,
  } = req.body;

  let salary;

  try {
    salary = new Salary({
      EmployeeID,
      Attendance,
      BasicSalary,
      Hours,
      Netsalary,
      paymentstatus,
    });
    await salary.save();
  } catch (err) {
    console.log(err);
  }
  //not insert salary
  if (!salary) {
    return res.status(404).send({ message: "unable to add salary" });
  }
  return res.status(200).json({ salary });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let salary;

  try {
    salary = await Salary.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!salary) {
    return res.status(404).json({ message: "Salary Not Found" });
  }
  return res.status(200).json({ salary });
};
//Update Salary Details
const updateSalary = async (req, res, next) => {
  const id = req.params.id;
  const {
    EmployeeID,
    Attendance,
    BasicSalary,
    Hours,
    Netsalary,
    paymentstatus,
  } = req.body;

  let salary;

  try {
    salary = await Salary.findByIdAndUpdate(
      id,
      {
        EmployeeID: EmployeeID,
        Attendance: Attendance,
        BasicSalary: BasicSalary,
        Hours: Hours,
        Netsalary: Netsalary,
        paymentstatus: paymentstatus,
      },
      { new: true }
    );
    salary = await Salary.save();
  } catch (err) {
    console.log(err);
  }
  //not available salary
  if (!salary) {
    return res.status(404).json({ message: "Unable to update Salary Details" });
  }
  return res.status(200).json({ salary });
};
//Delete Salary Details
const deleteSalary = async (req, res, next) => {
  const { id } = req.params;

  try {
    const salary = await Salary.findByIdAndDelete(id);

    if (!salary) {
      return res.status(404).json({ message: "Salary not found. Unable to delete." });
    }

    return res.status(200).json({ message: "Salary deleted successfully", salary });
  } catch (err) {
    console.error("Error deleting salary:", err);
    return res.status(500).json({ message: "Server error while deleting salary" });
  }
};


exports.getAllSalary = getAllSalary;
exports.addSalary = addSalary;
exports.getById = getById;
exports.updateSalary = updateSalary;
exports.deleteSalary = deleteSalary;
