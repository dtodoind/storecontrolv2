import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overall from "../../Components/Overall/Overall";

// import { Order_master } from "../../Data/Order_master";
// import { Employee_master } from "../../Data/Employee_master";
// import { Order_product } from "../../Data/Order_product";

import "./Orders.scss";
import DetailsOrder from "../../Components/DetailsOrder/DetailsOrder";
import EditOrder from "../../Components/EditOrder/EditOrder";
import AdminOrder from "../../Components/AdminOrder/AdminOrder";
import { connect } from "react-redux";
import AreYouSure from "../../Components/AreYouSure/AreYouSure";
import axios from "axios";
// import { store_Orders } from "../../Functions/AllFunctions";
// import FindProduct from '../../Components/FindProduct/FindProduct'

// prettier-ignore
function Orders({ setOrderDetails, setOrdering, boxes = false, employee = null, refund = false, seRefund, searchbox = true,  ...props }) {

	const { Orders, Sales_Activity, allsalesactivity, Status, allproduct, Products, allorders, Deposito} = props

	const [arr, setArr] = useState('desc')
	const [search, setSeatrch] = useState('')
	const [allorder, setAllOrders] = useState()
	const [filter_order, setFilterOrder] = useState()
	const [details_data, setDetailsData] = useState(null)
	const [order, setOrder] = useState(null)
	const [particular, setparticular] = useState(null)
	const [searching_val, setSearching_val] = useState('Nombre Cliente')
	const [return_val, setReturnVal] = useState()
	const [returned_data, setReturnedData] = useState(null)
	const [product, setProduct] = useState(null)

	const [year_sel, setYear_sel] = useState()
	const [month_sel, setMonth_sel] = useState()
	const [day_sel, setDay_sel] = useState()

	const [month_dis, setMonth_dis] = useState(true)
	const [day_dis, setDay_dis] = useState(true)

	const [year, setYear] = useState('')
	const [month, setMonth] = useState('')
	const [day, setDay] = useState('')

	const loop = useRef(true)

	useEffect(() => {
		var result = []
		// console.log('---------Order----------')
		if (details_data !== null) {
			for (var i = 0; i < details_data[0].order_product.length; i++) {
				var pro
				for (var j = 0; j < Products.length; j++) {
					// console.log(Products[j].Product_id, details_data[0].order_product[i].Product_id)
					if (Products[j].Product_id === details_data[0].order_product[i].Product_id) {
						pro = Products[j]
					}
				}
				result.push(pro)
			}
		}
		// console.log('Order', details_data, result)
		setProduct(result)

		async function order_data() {
			var y = Orders.map(ele => new Date(ele.Fecha).getFullYear())
			var whole_year = []
			y.filter(yea => !whole_year.includes(yea) ? whole_year.push(yea) : null)
			setYear_sel(whole_year)
			// await store_Orders('Orders', Status, Orders, allorders, notify)
			// if(Orders.length === 0) {
			// 	if(Status) {
			// 		await axios.get('https://storecontrolserverv2-production.up.railway.app/ordermaster')
			// 		.then(async (item) => {
			// 				console.log('Orders -> Orders')
			// 				item.data.sort(function (d1, d2) {
			// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 				});
			// 				allorders(item.data)
			// 				if(window.desktop) {
			// 					var flag = 0
			// 					await window.api.getAllData("Orders").then((item) => {
			// 						item.Orders.forEach(async function (ord, index) {
			// 							if(!Object.keys(ord).includes("Order_id")) {
			// 								flag = 1
			// 								return
			// 							}
			// 						})
			// 					});
			// 					if(flag === 0) {
			// 						// console.log('There is no values to save')
			// 						await window.api.addData(item.data, "Orders")
			// 					}
            //                 }
			// 			})
			// 	} else {
			// 		if(window.desktop) {
            //             await window.api.getAllData("Orders").then((item) => {
			// 				item.Orders.sort(function (d1, d2) {
			// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 				});
			// 				allorders(item.Orders)
			// 			});
			// 			await window.api.getAllData("Notification").then((item) => notify(item.Notification))
            //         }
			// 	}
			// }
		}
		if (loop.current && Orders.length !== 0) {
			order_data()
			loop.current = false
		}
		
		async function order_storing() {
			var DepositoLogin = JSON.parse(localStorage.getItem("DepositoLogin"))
			if(employee !== null || DepositoLogin.Type !== 'Master Manager') {
				var result = []
				for (let i = 0; i < Orders.length; i++) {
					var all_deposit = []
					all_deposit.push(DepositoLogin.nombre)
					var filter_deposit = Deposito.find(ele => ele.nombre === Orders[i].Deposito_name && ele.Deposito_id_fk === DepositoLogin.Deposito_id && ele.Type === 'Store')
					var fk_deposit = Deposito.find(ele2 => ele2.Deposito_id === DepositoLogin.Deposito_id_fk)
					if(filter_deposit) all_deposit.push(filter_deposit.nombre)
					if(fk_deposit) all_deposit.push(fk_deposit.nombre)
					if (all_deposit.includes(Orders[i].Deposito_name)) {
						result.push(Orders[i])
					}
				}
				setAllOrders(result)
				setFilterOrder(result)
			} else {
				setAllOrders(Orders)
				setFilterOrder(Orders)
			}
		}
		order_storing()
	}, [Orders, employee, Products, details_data, Deposito])

	const onChange = (e) => {
		setSeatrch(e.target.value)
		var result = []
		if(e.target.value !== '') {
			for (var i = 0; i < filter_order.length; i++) {
				if(searching_val === 'Nombre Vendedor') {
					var fullname = filter_order[i].Employee_name
					if (fullname.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
						result.push(filter_order[i])
					}
				} else {
					var client = filter_order[i].Client_name
					if(client.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
						result.push(filter_order[i])
					}
				}
			}
		} else {
			result = filter_order
		}
		setAllOrders(result)
	}

	const details = (product, pro) => {
		if (employee === null) {
			setDetailsData(product)
			setOrder(pro)
		} else {
			setOrderDetails(product)
			setOrdering(pro)
		}
	}

	const particularOrder = (index) => {
		setparticular(index)
	}

	const arrange = () => {
		setArr(arr === 'desc' ? 'asec' : 'desc')
		if(arr === 'desc') {
			allorder.sort(function (d1, d2) {
				return new Date(d1.createdAt) - new Date(d2.createdAt);
			});
		} else {
			allorder.sort(function (d1, d2) {
				return new Date(d2.createdAt) - new Date(d1.createdAt);
			});
		}
	}

	const returnProduct = async (val, pay=true) => {
		if(details_data[0].order_product.length === 1) {
			setDetailsData(null)
			setOrder(null)
			var stock = Products.filter((p) => p.Product_id === details_data[0].order_product[0].Product_id)[0].Stock
			var total_stock = stock[details_data[0].order_product[0].parentArray][details_data[0].order_product[0].childArray] + details_data[0].order_product[0].Qty
			stock[details_data[0].order_product[0].parentArray][details_data[0].order_product[0].childArray] = total_stock
			var req_data = {
				Product_id: details_data[0].order_product[0].Product_id,
				Stock: JSON.stringify(stock)
			}
			var single_pro = Products.findIndex((p) => p.Product_id === details_data[0].order_product[0].Product_id)
			Products[single_pro].Stock = stock
			allproduct(Products)
			// console.log(Products[single_pro].Stock)
			if(window.desktop) {
				await window.api.addData(Products, "Products");
			}
			if(Status) {
				await axios.put('https://storecontrolserverv2-production.up.railway.app/product/quantity', req_data)
				if(pay) {
					await axios.delete(`https://storecontrolserverv2-production.up.railway.app/ordermaster/delete/${order.Order_id}`)
				}
				await axios.delete(`https://storecontrolserverv2-production.up.railway.app/orderproduct/delete/${val.Order_pro_id}`)
				.then(async item => {
					await axios.get('https://storecontrolserverv2-production.up.railway.app/ordermaster')
						.then(async prod => {
							let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
							prod.data.sort(function (d1, d2) {
								return new Date(d2.createdAt) - new Date(d1.createdAt);
							});
							allorders(prod.data)
							if(window.desktop) {
								await window.api.addData(prod.data, "Orders")
							}
							var year = new Date(order.createdAt).getFullYear()
							var month = new Date(order.createdAt).getMonth()
							var date = new Date(order.createdAt).getDate()
							var tot = 0
							for(var q=0; q<prod.data.length; q++) {
								if(new Date(prod.data[q].createdAt).toDateString() === new Date(order.createdAt).toDateString()) {
									tot = prod.data[q].Total_price + tot
								}
							}
							var index = Sales_Activity.findIndex(item => item.year === year)
							Sales_Activity[index][months_data[month]][date-1].sales = tot
							for(var t=0; t < Sales_Activity.length; t++) {
								for(var m=0; m < months_data.length; m++) {
									Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
								}
							}
							await axios.put('https://storecontrolserverv2-production.up.railway.app/salesactivity/day', {
								Sales_id: Sales_Activity[index].Sales_id,
								...Sales_Activity[index]
							})
							await axios.get('https://storecontrolserverv2-production.up.railway.app/salesactivity')
								.then(async item => {
									for(var t=0; t < item.data.length; t++) {
										for(var m=0; m < months_data.length; m++) {
											item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
										}
									}
									allsalesactivity(item.data)
								})
						})
				})
			} else {
				var ord = Orders.filter(x => x.Order_id === undefined ? x.Fecha !== order.Fecha ? x : null : x.Order_id !== order.Order_id ? x : null)
				ord.sort(function (d1, d2) {
					return new Date(d2.createdAt) - new Date(d1.createdAt);
				});
				allorders(ord)
				if(window.desktop) {
					await window.api.addData(ord, "Orders")
					var ord_ret2 = []
					await window.api.getAllData('Orders_Returns').then(async return_ord => {
						// console.log(return_ord.Orders_Returns)
						if(return_ord.Orders_Returns) {
							ord_ret2 = return_ord.Orders_Returns
						}
						var extra = {
							...req_data,
							order: order,
							del: true,
							val: val
						}
						ord_ret2.push(extra)
						// console.log(ord_ret)
						await window.api.addData(ord_ret2, "Orders_Returns")
					})
				}
			}
		} else {
			var stock_el = Products.filter((p) => p.Product_id === val.Product_id)[0].Stock
			var total_stock_el = stock_el[val.parentArray][val.childArray] + val.Qty
			stock_el[val.parentArray][val.childArray] = total_stock_el
			var req_data_el = {
				Product_id: val.Product_id,
				Stock: JSON.stringify(stock_el)
			}
			var single_pro_el = Products.findIndex((p) => p.Product_id === val.Product_id)
			Products[single_pro_el].Stock = stock_el
			allproduct(Products)
			// console.log(Products[single_pro_el].Stock)
			if(window.desktop) {
				await window.api.addData(Products, "Products");
			}
			var spec = details_data[0].order_product.filter(function(x) {return !(x.Order_pro_id === val.Order_pro_id)})
			details_data[0].order_product = spec
			var prod = product.filter(ele => ele.Product_id !== val.Product_id)
			setDetailsData(details_data)
			setProduct(prod)
			// console.log({...order, Total_price: order.Total_price - val.Total_price}, order, details_data)
			// setOrder({...order, Total_price: order.Total_price - val.Total_price})
			if(Status) {
				await axios.put('https://storecontrolserverv2-production.up.railway.app/product/quantity', req_data_el)
				if(pay) {
					await axios.put(`https://storecontrolserverv2-production.up.railway.app/ordermaster/price`, {
						Order_id: order.Order_id,
						Total_price: order.Total_price - val.Total_price
					})
				}
				await axios.delete(`https://storecontrolserverv2-production.up.railway.app/orderproduct/delete/${val.Order_pro_id}`)
					.then(async item => {
						await axios.get('https://storecontrolserverv2-production.up.railway.app/ordermaster')
							.then( async prod => {
								let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
								prod.data.sort(function (d1, d2) {
									return new Date(d2.createdAt) - new Date(d1.createdAt);
								});
								allorders(prod.data)
								if(window.desktop) {
									await window.api.addData(prod.data, "Orders")
								}
								var year = new Date(order.createdAt).getFullYear()
								var month = new Date(order.createdAt).getMonth()
								var date = new Date(order.createdAt).getDate()
								var tot = 0
								for(var q=0; q<prod.data.length; q++) {
									if(new Date(prod.data[q].createdAt).toDateString() === new Date(val.createdAt).toDateString()) {
										tot = prod.data[q].Total_price + tot
									}
								}
								var index = Sales_Activity.findIndex(item => item.year === year)
								Sales_Activity[index][months_data[month]][date-1].sales = tot
								for(var t=0; t < Sales_Activity.length; t++) {
									for(var m=0; m < months_data.length; m++) {
										Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
									}
								}
								await axios.put('https://storecontrolserverv2-production.up.railway.app/salesactivity/day', {
									Sales_id: Sales_Activity[index].Sales_id,
									...Sales_Activity[index]
								})
								await axios.get('https://storecontrolserverv2-production.up.railway.app/salesactivity')
									.then(async item => {
										for(var t=0; t < item.data.length; t++) {
											for(var m=0; m < months_data.length; m++) {
												item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
											}
										}
										allsalesactivity(item.data)
									})
							})
					})
			} else {
				details_data[0].Total_price = details_data[0].Total_price - val.Total_price
				var ord2 = Orders.map(x => x.Order_id === undefined ? x.Fecha !== details_data.Fecha ? x : details_data : x.Order_id !== details_data.Order_id ? x : details_data)
				allorders(ord2)
				if(window.desktop) {
					await window.api.addData(ord2, "Orders")
					var ord_ret = []
					await window.api.getAllData('Orders_Returns').then(async return_ord => {
						// console.log(return_ord.Orders_Returns)
						if(return_ord.Orders_Returns) {
							ord_ret = return_ord.Orders_Returns
						}
						var extra = {
							...req_data_el,
							order: order,
							del: false,
							val: val
						}
						ord_ret.push(extra)
						// console.log(ord_ret)
						await window.api.addData(ord_ret, "Orders_Returns")
					})
				}
			}
		}
	}

	const makeNumArr = num => new Array(num).fill("").map((_, i) => i + 1);

	const sorting_year = (e) => {
		setYear(e.target.value)
		if(e.target.value === 'All') {
			setAllOrders(filter_order)
			setMonth_dis(true)
			setDay_dis(true)
		} else {
			setAllOrders(filter_order.filter(ele => new Date(ele.Fecha).getFullYear() === parseInt(e.target.value)))
			setMonth_dis(false)
		}
		setMonth('')
		setDay('')
		setMonth_sel(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
	}

	const sorting_month = (e) => {
		setMonth(e.target.value)
		if(e.target.value === 'All') {
			setAllOrders(filter_order.filter(ele => new Date(ele.Fecha).getFullYear() === parseInt(year)))
			setDay_dis(true)
		} else {
			setAllOrders(filter_order.filter(ele => 
				new Date(ele.Fecha).getFullYear() === parseInt(year) &&
				new Date(ele.Fecha).getMonth() === month_sel.indexOf(e.target.value)
			))
			setDay_dis(false)
		}
		setDay('')
		setDay_sel(makeNumArr(new Date(year, month_sel.indexOf(e.target.value)+1, 0).getDate()))
	}

	const sorting_day = (e) => {
		setDay(e.target.value)
		if(e.target.value === 'All') {
			setAllOrders(filter_order.filter(ele => 
				new Date(ele.Fecha).getFullYear() === parseInt(year) &&
				new Date(ele.Fecha).getMonth() === month_sel.indexOf(month)
			))
		} else {
			setAllOrders(filter_order.filter(ele => 
				new Date(ele.Fecha).getFullYear() === parseInt(year) &&
				new Date(ele.Fecha).getMonth() === month_sel.indexOf(month) &&
				new Date(ele.Fecha).getDate() === parseInt(e.target.value)
			))
		}
	}

	// ----------------OVERALL DATA------------------------
	let cantVentas = filter_order?.length;
	const cobradoVentas =()=>{
		let total;
		let onlyPaid =  allorder?.filter(status => status.Order_status==="Paid")
		total= onlyPaid?.reduce((acc, value) => acc + value.Total_price, 0)
		return total;
	}
	const no_Cobrado =()=>{
		let total;
		let onlyPaid =  allorder?.filter(status => status.Order_status==="Unpaid");
		total= onlyPaid?.reduce((acc, value) => acc + value.Total_price, 0)
		return total;
	}
	let totalVentas = allorder?.reduce((acc, value )=> acc + value.Total_price, 0);

	
	return (
		<div className='orders_main' style={{ padding: searchbox ? 20 : 0 }}>
			{
				boxes
					? <div className='container-fluid p-0 my-2'>
						<div className='row'>
							<div className='col-md p-2'>
								<Overall title="Cantidad de Ventas" stock={cantVentas} color="rgb(250,143,19)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="Cobrado" price={cobradoVentas()} color="rgb(126,204,106)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="A cobrar" price={no_Cobrado()} color="rgb(244,96,96)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="Total de Ventas" price={totalVentas} color="rgb(240,6,217)" />
							</div>
						</div>
					</div>
					: null

			}

			{
				employee === null && searchbox
					? <div className='container-fluid p-0'>
						<div className='row'>
							<div className='col-md my-2'>
								{/* <NewProduct details_data={details_data} setDetailsData={setDetailsData}  /> */}
								<button type='button' className='btn btn-dark' data-toggle='modal' data-target='#adminorder'>Nueva Venta</button>
							</div>
							<div className='col-md text-right my-2 d-flex justify-content-end align-items-center'>
								<div className="d-flex justify-content-end">
									<select className="search_day" onChange={(e) => setSearching_val(e.target.value)}>
										<option name="Nombre Cliente" value="Nombre Cliente">Nombre Cliente</option>
										{
											JSON.parse(localStorage.getItem("DepositoLogin")).Type !== "Manager"
											? <option name="Deposito" value="Deposito">Deposito</option>
											: null
										}
										<option name="Date" value="Date">Date</option>
										{/* <option name="Categoria" value="Categoria">Categoria</option> */}
									</select>
									{
										searching_val !== 'Date'
										? <div className='d-flex justify-content-end'>
											<div className='search'>
												<input type='text' className='txt_input' placeholder={`Search by ${searching_val}`} defaultValue={search} onChange={onChange} />
												<button className='btn'>
													<FontAwesomeIcon icon="search" size='lg' />
												</button>
											</div>
										</div>
										: <div>
											<select className="p-1" value={year} onChange={sorting_year}>
												<option value='' disabled>Year</option>
												{
													year_sel
													? <>
														<option value='All'>All</option>
														{
															year_sel?.map(yea => <option value={yea} key={yea}>{yea}</option>)
														}
													</>
													: null
												}
											</select>
											<select className="p-1" value={month} onChange={sorting_month} disabled={month_dis}>
												<option value='' disabled>Month</option>
												{
													month_sel
													? <>
														<option value='All'>All</option>
														{
															month_sel?.map(mont => <option value={mont} key={mont}>{mont}</option>)
														}
													</>
													: null
												}
											</select>
											<select className="p-1" value={day} onChange={sorting_day} disabled={day_dis}>
												<option value={''} disabled>Day</option>
												{
													day_sel
													? <>
														<option value='All'>All</option>
														{day_sel?.map(da => 
															<option value={da} key={da}>{da}</option>
														)}
													</>
													: null
												}
											</select>
										</div>
									}
								</div>
							</div>
						</div>
					</div>
					: null
			}

			<div className='table_overflow'>
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th scope="col" className='text-center'>ID</th>
							<th scope="col" className='text-center'>Nombre Cliente</th>
							<th scope="col" className='text-center'>Deposito</th>
							<th scope="col" className='text-center'>Precio Total</th>
							<th scope="col" className='text-center'>Productos Total</th>
							<th scope="col" className='text-center' style={{ cursor: 'pointer' }} onClick={arrange}>
								Fecha {
									arr === 'desc' 
									? <FontAwesomeIcon icon="angle-down" style={{ color: 'gray', fontSize: 15 }} /> 
									: <FontAwesomeIcon icon="angle-up" style={{ color: 'gray', fontSize: 15 }} />
								}
								</th>
							<th scope="col" className='text-center'>Nombre Vendedor</th>
							<th scope="col" className='text-center'>Estado Orden</th>
							{
								refund
									? <th scope="col" className='text-center'>Reembolso</th>
									: null
							}
						</tr>
					</thead>
					<tbody>
						{
							allorder?.map((pro, index) =>
								<tr key={index} style={{ cursor: 'pointer' }} onClick={() => { if (!refund) details(Orders?.filter(function (x) { return x.Order_id === undefined ? x.Fecha === pro.Fecha ? x : null : x.Order_id === pro.Order_id ? x : null }), pro) }} data-toggle="modal" data-target="#detailsorder">
									<th scope="row" className='text-center align-middle'>{index + 1}</th>
									<td className='text-center align-middle'>{pro.Client_name}</td>
									<td className='text-center align-middle'>{pro.Deposito_name}</td>
									<td className='text-center align-middle'>${pro.Total_price}</td>
									<td className='text-center align-middle'>{pro.order_product?.length}</td>
									<td className='text-center align-middle'>{pro.Fecha.split(',')[0]}</td>
									<td className='text-center align-middle'>
										{pro.Employee_name}
										{/* <span>{Employee?.filter(item => item.Employee_id === pro.Employee_id)[0]?.First_name} &nbsp;
										{Employee?.filter(item => item.Employee_id === pro.Employee_id)[0]?.Last_name} </span> */}
									</td>
									<td className='text-center align-middle'>
										{pro?.Order_status === 'Paid' ? (
											<span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>Cobrado</span>

										) : (<span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>A cobrar</span>

										)

										}
									</td>
									{
										refund
											? <td className='text-center align-middle'><button className='btn btn-danger' data-toggle='modal' data-target='#areyousure'>Refund</button></td>
											: null
									}
								</tr>
							)
						}
					</tbody>
				</table>
				{
					employee === null
						? <>
							<DetailsOrder details_data={details_data} setDetailsData={setDetailsData} order={order} setOrder={setOrder} particularOrder={particularOrder} setReturnVal={setReturnVal} product={product} />
							<AreYouSure returnProduct={returnProduct} return_val={return_val} setReturnedData={setReturnedData} />
							<EditOrder details_data={details_data} particular={particular} />
							<AdminOrder setOrder_Data={setDetailsData} returned_data={returned_data} order_return={order} setOrderReturn={setOrder} setReturnedData={setReturnedData} returnProduct={returnProduct} return_val={return_val} />
						</>
						: null
				}
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        Sales_Activity: state.Sales_Activity,
        Notific: state.NotifyMaster,
        Orders: state.Orders,
        Status: state.Status,
        Deposito: state.Deposito,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
        allemployee: (val) => {
            dispatch({
                type: "EMPLOYEE",
                item: val,
            });
        },
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
