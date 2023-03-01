import React, { useState, useEffect, useRef } from "react";
import "./Expenses.scss";
import NewExpense from "../../Components/NewExpense/NewExpense";
import ExpenseEdit from "../../Components/NewExpense/ExpenseEdit";
// import { Expense_master } from "../../Data/Expense_master";
import axios from "axios";
import { connect } from "react-redux";
import { IoCloseCircle } from "react-icons/io5";
// import { AiFillEdit } from "react-icons/ai";
import { store_Desposito, store_Expensecat, store_Expenses } from "../../Functions/AllFunctions";
// import DetailsProduct from "../../Components/DetailsProduct/DetailsProduct";

// prettier-ignore
function Expenses(props) {

	const { expense_category, Expenses, allexp, Expensecat, Status, Deposito, deposito } = props;

	const [modalShow, setModalShow] = useState(false);
	const [value, onChange] = useState(new Date());
	const [allExpenses, setAllExpenses] = useState();
	// const [allDataExp, setallDataExp] = useState(null);
	const [editexp, seteditexp]=useState();
	const loop = useRef(true)
	const expense_loop = useRef(true)

	// console.log(Expensecat, 'expense cat')

	useEffect(() => {
		//the first conditional not work
		async function exp() {
			await store_Desposito('Expenses', Status, Deposito, deposito)
            await store_Expenses('Expenses', Status, Expenses, allexp)
            await store_Expensecat('Expenses', Status, Expensecat, expense_category)
			// if (Expenses.length === 0) {
			// 	if (Status) {
			// 		await axios.get("https://storecontrolserverv2-production.up.railway.app/expense").then(async (item) => {
			// 			console.log('all expenses')
			// 			// setallDataExp(item.data)
			// 			allexp(item.data)
			// 			if (window.desktop) {
			// 				await window.api.getAllData("Expenses").then(async (item2) => {
			// 					item2.Expenses.forEach(async function (exp, index) {
            //                         if(!Object.keys(exp).includes('ExpenseId')) {
			// 							await axios.post("https://storecontrolserverv2-production.up.railway.app/expense/new", exp)
			// 							.then(async (item3) => {
			// 								var m = item.data;
			// 								m.push(item3.data);
			// 								allexp(m);
			// 								await window.api.addData(m, "Expenses")
			// 								// console.log(allExpenses, 'details')
			// 							}).catch(err => console.log(err))
			// 						}
			// 					})
			// 				});
			// 				await window.api.addData(item.data, "Expenses")
			// 			}
			// 		})
			// 	} else {
			// 		if (window.desktop) {
			// 			await window.api.getAllData("Expenses").then((item) => allexp(item.Expenses));
			// 		}
			// 	}
			// }
			// if (Expensecat.length === 0) {
			// 	if (Status) {
			// 		await axios.get("https://storecontrolserverv2-production.up.railway.app/expensecat").then(async (item) => {
			// 			console.log("ExpenseCat -> All Expensecate")
			// 			item.data.sort(function (d1, d2) {
			// 				return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 			});
			// 			expense_category(item.data)
			// 			if (window.desktop) {
			// 				await window.api.getAllData("Expensecat").then(async (item2) => {
			// 					item2.Expensecat.forEach(async function (exp_cate, index) {
			// 						if(!Object.keys(exp_cate).includes('CategoryExpense_id')) {
			// 							await axios.post("https://storecontrolserverv2-production.up.railway.app/expensecat/new", exp_cate).then(async (item3) => {
			// 								console.log("ExpenseCat -> new expensecate")
			// 								expense_category(item3.data);
			// 							}).catch(err => console.log(err))
			// 						}
			// 					})
			// 				});
			// 				item.data.sort(function (d1, d2) {
			// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 				});
			// 				await window.api.addData(item.data, "Expensecat")
			// 			}
			// 		})
			// 	} else {
			// 		if (window.desktop) {
			// 			await window.api.getAllData("Expensecat").then((item) => {
			// 				item.Expensecat.sort(function (d1, d2) {
			// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 				});
			// 				expense_category(item.Expensecat)
			// 			});
			// 		}
			// 	}
			// }
		}
		if (loop.current) {
			exp()
			loop.current = false
		}

		async function store_expense() {
			// if(Status && window.desktop) {
			// 	await window.api.getAllData("Expenses").then(async (item2) => {
			// 		await axios.get("https://storecontrolserverv2-production.up.railway.app/expense").then(async (item) => {
			// 			// console.log(item.data, item2.Expenses)
			// 			if(item.data.length > item2.Expenses.length) {
			// 				item.data.forEach(async function(ex) {
			// 					var flag = 0
			// 					for(var v=0; v<item2.Expenses.length; v++) {
			// 						// console.log(item.data[h].ExpenseId, item2.Expenses[v].ExpenseId)
			// 						if(ex.ExpenseId === item2.Expenses[v].ExpenseId) {
			// 							flag = 1
			// 							break
			// 						}
			// 					}
			// 					if(flag === 0) {
			// 						// console.log('Should Delete Expense')
			// 						await axios.delete(`https://storecontrolserverv2-production.up.railway.app/expense/delete/${ex.ExpenseId}`).then(async dele => {
			// 							await axios.get("https://storecontrolserverv2-production.up.railway.app/expense").then(async (item7) => {
			// 								item7.data.sort(function (d1, d2) {
			// 									return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 								});
			// 								allexp(item7.data)
			// 								setAllExpenses(item7.data)
			// 								await window.api.addData(item7.data, "Expenses")
			// 							})
			// 						})
			// 					}
			// 				})
			// 			} 
			// 			if(item.data.length === item2.Expenses.length) {
			// 				item2.Expenses.forEach(async (new_exp) => {
			// 					var find_exp = item.data.find(al => al.ExpenseId === new_exp.ExpenseId)
			// 					var flag1 = 0
			// 					if(find_exp) {
			// 						if(find_exp.date !== new_exp.date ||
			// 							find_exp.Total !== new_exp.Total ||
			// 							find_exp.Description !== new_exp.Description ||
			// 							find_exp.PayMethod !== new_exp.PayMethod ||
			// 							find_exp.CategoryExpense_id !== new_exp.CategoryExpense_id) {
			// 								flag1 = 1
			// 						}
			// 					}
			// 					if(flag1 === 1) {
			// 						// console.log('Should Update Expense', new_exp)
			// 						await axios.put("https://storecontrolserverv2-production.up.railway.app/expense/edit", new_exp).catch(err => console.log(err))
			// 						await axios.get("https://storecontrolserverv2-production.up.railway.app/expense").then(async (item3) => {
			// 							// var exp_new = Expenses.map(exp => exp.ExpenseId === new_exp.ExpenseId ? new_exp : exp)
			// 							item3.data.sort(function (d1, d2) {
			// 								return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 							});
			// 							allexp(item3.data)
			// 							setAllExpenses(item3.data)
			// 							await window.api.addData(item3.data, "Expenses")
			// 							// console.log('succes update front ')
			// 						})
			// 					}
			// 				})
			// 			}
			// 		})
			// 	});
			// }
		}
		if(expense_loop.current && Expenses.length !==0) {
			store_expense()
			expense_loop.current = false
		}
	}, [Expenses, Expensecat, allexp, expense_category, Status, Deposito, deposito])

	const removeExp = async (id) => {
		var e = Expenses.filter(function (x) { return x.ExpenseId !== id })

		var result = [];
		result = e

		allexp(result)
		if(Status) {
			await axios.delete(`https://storecontrolserverv2-production.up.railway.app/expense/delete/${id}`);
		} else {
			if(window.desktop) {
				await window.api.addData(result, "Expenses")
				var exp_ret2 = []
                await window.api.getAllData('Expenses_Returns').then(async return_exp => {
                    // console.log(return_ord.Orders_Returns)
                    if(return_exp.Expenses_Returns) {
                        exp_ret2 = return_exp.Expenses_Returns
                    }
                    var extra = {
                        Expense_id: id,
                    }
                    exp_ret2.push(extra)
                    // console.log(ord_ret)
                    await window.api.addData(exp_ret2, "Expenses_Returns")
                })
			}
		}
	}

	return (
		<div className="expenses">
			{" "}
			<div className="btn_new_expense">
				<button
					type="button"
					className="btn_color"
					data-toggle="modal"
					data-target="#newexpense"
				// onClick={() => setModalShow(true)}
				>
					Nuevo Gasto
				</button>

				<div className='table_overflow'>
					<table className="table table-striped table-hover">
						<thead>
							<tr>
								<th scope="col" className='text-center'>ID</th>
								<th scope="col" className='text-center'>Fecha</th>
								<th scope="col" className='text-center'>Total</th>
								<th scope="col" className='text-center'>Categoría</th>
								<th scope="col" className='text-center'>Deposito</th>
								<th scope="col" className='text-center'>Descripción</th>
								<th scope="col" className='text-center'>Tipo de Pago</th>
								<th scope="col" className='text-center'>Eliminar</th>
							</tr>
						</thead>
						<tbody>
							{Expenses?.map((i, key) => (
								<tr key={key}>
									<th scope="row" className='text-center align-middle'>{key+1}</th>
									<td className='text-center align-middle'>{i.date.split(',')[0]}</td>
									<td className='text-center align-middle'>${i.Total}</td>
									<td className='text-center align-middle'> {Expensecat?.filter(function (x) { return x.CategoryExpense_id === i.CategoryExpense_id })[0]?.nombre}</td>
									<td className='text-center align-middle'>{Deposito.length !== 0 ? Deposito?.find(ele => ele.Deposito_id === i.Deposito_id).nombre : null}</td>
									<td className='text-center align-middle'>{i.Description}</td>
									<td className='text-center align-middle'>{i.PayMethod}</td>
									<td className='edit text-center align-middle'> 
										<IoCloseCircle style={{ display: "inline" }} onClick={() => removeExp(i.ExpenseId)} className="close_icon_ind" />
										{/* <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind" onClick={() => seteditexp(i)}  data-toggle="modal" data-target="#expenseedit" /> */}
									</td>
								</tr>

							))}
						</tbody>
					</table>
				</div>
			</div>
			
			<NewExpense  show={modalShow} onHide={() => setModalShow(false)} onChange={onChange} value={value} />
			<ExpenseEdit onChange={onChange} value={value} allExpenses={allExpenses} setAllExpenses={setAllExpenses} editexp={editexp} seteditexp={seteditexp}/>
		</div>
	);
}

const mapStateToProps = (state) => {
    return {
        Expenses: state.Expenses,
        Expensecat: state.Expensecat,
        Deposito: state.Deposito,
        Status: state.Status,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        deposito: (val) => {
            dispatch({
                type: "DEPOSITO",
                item: val,
            });
        },
        allexp: (val) => {
            dispatch({
                type: "EXPENSES",
                item: val,
            });
        },
        expense_category: (val) => {
            dispatch({
                type: "EXPENSECAT",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
