const { Employee, EmployeeLeaves, EmployeeLocation } = require('../model');

const { SUCCESS, FAILED } = require('../constant/CommonConstants');

const { idGenerator } = require('../utils/EmployeeIdGenerator');

const promisify = require('util').promisify;
//# employee
{
	exports.insertManyEmployee = (req, res) => {
		const { data } = req.body;

		const empData = [];

		data &&
			data.map((emp) => {
				empData.push({
					emp_id: emp.id,
					first_name: emp.first_name,
					last_name: emp.last_name,
					emp_email: emp.email,
					emp_gender: emp.gender,
					address_pincode: emp.address_pincode,
					address_state: emp.address_state,
					address_city: emp.address_city,
					emp_department: emp.department,
				});
			});

		Employee.insertMany(empData, { upsert: true })
			.then((result) => {
				res.json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				console.log(err);
				res.json({
					message: FAILED,
				});
			});
	};

	exports.insertOneEmployee = async (req, res) => {
		const emp_id = await idGenerator();

		const {
			first_name,
			last_name,
			email,
			gender,
			address_pincode,
			address_state,
			address_city,
			department,
			is_trashed,
			is_admin,
			is_active,
		} = req.body;

		const list = new Employee({
			emp_id: emp_id,
			first_name: first_name,
			last_name: last_name,
			emp_email: email,
			emp_gender: gender,
			address_pincode: address_pincode,
			address_state: address_state,
			address_city: address_city,
			emp_department: department,
			is_trashed: is_trashed,
			is_admin: is_admin,
			is_active: is_active,
		});

		list
			.save()
			.then((result) => {
				res.json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				console.log(err);
				res.json({
					message: FAILED,
				});
			});
	};

	exports.getEmployee = async (req, res) => {
		var arr = await Employee.find()
			.then((result) => {
				res.status(200).json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				if (err) {
					console.log(err);
					res.json({
						message: FAILED,
					});
				}
			});
		return arr;
	};

	exports.getEmployeeById = async (req, res) => {
		const { id } = req.params;

		const location = await EmployeeLocation.find({ emp_id: id });

		Employee.find({ emp_id: id, is_trashed: false })
			.then((result) => {
				res.status(200).json({
					result: result[0],
					message: SUCCESS,
				});
			})
			.catch((err) => {
				if (err) {
					console.log(err);
					res.json({
						message: FAILED,
					});
				}
			});
	};
}

//# employee Leave
{
	exports.insertEmpLeaves = (req, res) => {
		const {
			emp_id,
			emp_leave_startDate,
			emp_leave_endDate,
			is_recent_record,
			emp_leave_reason,
			is_approved,
		} = req.body;

		const list = new EmployeeLeaves({
			emp_id: emp_id,
			emp_leave_startDate: emp_leave_startDate,
			emp_leave_endDate: emp_leave_endDate,
			is_recent_record: is_recent_record,
			emp_leave_reason: emp_leave_reason,
			is_approved: is_approved,
		});

		list
			.save()
			.then((result) => {
				res.status(200).json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				console.log(err);
				if (err) {
					res.json({
						message: FAILED,
					});
				}
			});
	};

	exports.getEmployeeLeaves = (req, res) => {
		EmployeeLeaves.find()
			.then((result) => {
				res.status(200).json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				if (err) {
					res.json({
						message: FAILED,
					});
				}
			});
	};

	exports.getEmployeeLeavesById = (req, res) => {
		const { id } = req.params;
		console.log(id);
		EmployeeLeaves.find({ emp_id: id })
			.then((result) => {
				res.status(200).json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				if (err) {
					res.json({
						message: FAILED,
					});
				}
			});
	};
	exports.updateEmployeeLeavesStatusById = (req, res) => {
		const { emp_id, is_approved } = req.body;
		//console.log(id, is_approved);
		EmployeeLeaves.updateOne(
			{ emp_id: parseInt(emp_id, 10), is_recent_record: true },
			{ is_recent_record: false, is_approved: is_approved },
		)
			.then((result) => {
				res.status(200).json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				if (err) {
					console.log(err);
					res.json({
						message: FAILED,
					});
				}
			});
	};
}
//# employee location
{
	exports.insertEmpLocation = (req, res) => {
		const { emp_id, longitude, latitude, is_current_location, is_loggedin } =
			req.body;
		console.log(is_loggedin);
		EmployeeLocation.find({ emp_id: emp_id }).then((result) => {
			if (result) {
				console.log(result[0].emp_id);
				EmployeeLocation.update(
					{ emp_id: parseInt(result[0].emp_id, 10) },
					{
						$set: {
							latitude: latitude,
							longitude: longitude,
							is_loggedin: is_loggedin,
						},
					},
				)
					.then((result) => {
						res.status(200).json({
							result,
							message: SUCCESS,
						});
					})
					.catch((err) => {
						if (err) {
							res.json({
								message: FAILED,
							});
						}
					});
			} else {
				const list = new EmployeeLocation({
					emp_id: emp_id,
					longitude: longitude,
					latitude: latitude,
					is_current_location: is_current_location,
					is_loggedin: is_loggedin,
				});

				list
					.save()
					.then((result) => {
						res.status(200).json({
							result,
							message: SUCCESS,
						});
					})
					.catch((err) => {
						if (err) {
							res.json({
								message: FAILED,
							});
						}
					});
			}
		});
	};
	exports.getEmployeeLocation = (req, res) => {
		EmployeeLocation.find({
			is_current_location: true,
		})
			.then((result) => {
				res.status(200).json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				console.log(err);
				if (err) {
					res.json({
						message: FAILED,
					});
				}
			});
	};
	exports.getEmployeeLocationById = (req, res) => {
		const { id } = req.params;
		EmployeeLocation.find({
			emp_id: parseInt(id, 10),
			is_current_location: true,
		})
			.then((result) => {
				res.status(200).json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				console.log(err);
				if (err) {
					res.json({
						message: FAILED,
					});
				}
			});
	};
	exports.updateEmployeeLocationStatusById = (req, res) => {
		const { emp_id } = req.params;

		EmployeeLocation.updateOne(
			{ emp_id: parseInt(emp_id, 10), is_current_location: true },
			{ is_current_location: false },
		)
			.then((result) => {
				res.status(200).json({
					result,
					message: SUCCESS,
				});
			})
			.catch((err) => {
				if (err) {
					console.log(err);
					res.json({
						message: FAILED,
					});
				}
			});
	};
}
//# get total count of employee ,department,isActive
{
	exports.getTotalCount = async (req, res) => {
		const empTotalcnt = await Employee.find({ is_trashed: false }).count();
		const empActiveCnt = await Employee.find({
			is_active: true,
			is_trashed: false,
		}).count();
		// const totalDepCnt = await Employee.Distinct('emp_department').count();

		res.json({
			result: [
				{ label: 'Total Employee', count: empTotalcnt },
				{ label: 'Total Active', count: empActiveCnt },
				{ label: 'Total Department', count: 18 },
				//totalDepCnt: totalDepCnt,
			],
		});
	};
}

exports.loginUser = (req, res) => {
	const { email, first_name } = req.body;

	Employee.find({ emp_email: email })
		.then((result) => {
			if (result.length < 1) {
				throw new Error('Data not found');
			}
			res.json({ result: result[0] });
		})
		.catch((err) => {
			res.json({ message: FAILED });
		});
};
