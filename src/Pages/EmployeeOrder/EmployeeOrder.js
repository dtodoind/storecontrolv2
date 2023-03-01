import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactToPrint } from "react-to-print";

import "./EmployeeOrder.scss";
import OrderList from "../../Components/OrderList/OrderList";
// import NewProduct from "../../Components/NewProduct/NewProduct";
import DetailsOrder from "../../Components/DetailsOrder/DetailsOrder";
import Orders from "../Orders/Orders";
import EditOrder from "../../Components/EditOrder/EditOrder";
import { Link } from "react-router-dom";
import PayOrder from "../../Components/PayOrder/PayOrder";
import AreYouSure from "../../Components/AreYouSure/AreYouSure";
import SendMessage from "../../Components/SendMessage/SendMessage";
import FindProduct from "../../Components/FindProduct/FindProduct";
// import { Order_master } from "../../Data/Order_master";
import Notification from "../../Components/Notification/Notification";
import { connect } from "react-redux";
import axios from "axios";

// prettier-ignore
function EmployeeOrder(props) {
    const { Products, allproduct, allorders, allsalesactivity, Sales_Activity, Status } = props
    const [details_data, setDetailsData] = useState(null);
    const [order, setOrder] = useState();
    const [allpro, setAllPro] = useState(Products)
	const [client_name, setClientName] = useState('')
	const [employee_name, setEmployeeName] = useState('')

    const [order_details, setOrderDetails] = useState(null);
    const [ordering, setOrdering] = useState(null);
    const [particular, setparticular] = useState(null);
    const [product, setProduct] = useState(null)
	const [returned_data, setReturnedData] = useState(null)
	const [return_val, setReturnVal] = useState()
    const [Province, setProvince] = useState();

    // const [productinsert, setProductInsert] = useState(null);
    const [paymentType, setPaymentType] = useState("Compras por Mayor");
	const [deposito_err, setDepositoErr] = useState('')

    const [refund, setRefund] = useState(false);

    const neworder = () => {
        setDetailsData(null);
        setOrder(null);
    };

    const cancelorder = () => {
        setDetailsData(null);
        setOrder(null);
    };

    const particularOrder = (index) => {
        setparticular(index);
    };

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const addorder = (pro, code, inn, j) => {
        var today = new Date();
        var dd = JSON.stringify(today.getDate()).padStart(2, "0");
        var mm = JSON.stringify(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        var pricing = 0;
        if (paymentType === "Compras por Mayor") {
            pricing = pro.costoCompra[inn][j];
        } else if (paymentType === "Compra por menor") {
            pricing = pro.costoMenor[inn][j];
        }

        today = mm + "/" + dd + "/" + yyyy;
        var all_details = details_data;
        if(employee_name === '') {
            setDepositoErr("Seleccione Nombre Vendedor")
        } else {
            if (all_details === null) {
                var order_data = {
                    // Order_id: Order_master[Order_master.length - 1].Order_id + 1,
                    Total_price: pricing,
                    Fecha: new Date().toLocaleString("en-US"),
                    Tipo_de_Cliente: paymentType,
                    Order_status: "Unpaid",
                    Employee_name: employee_name,
                    Deposito_name: JSON.parse(localStorage.getItem('DepositoLogin')).nombre
                };
                var order_pro = {
                    Qty: 1,
                    Total_price: pricing,
                    code: code,
                    parentArray: inn,
                    childArray: j,
                    Product_id: pro.Product_id,
                    Order_id: order_data.Order_id,
                    // codigo: pro.codigo[inn][j],
                    // Image: pro.Image[inn],
                    // Color: pro.Color[inn][j],
                    // Size: pro.Size[inn][j],
                    // Stock: pro.Stock[inn][j],
                    // precioVenta: pro.precioVenta[inn][j],
                    // costoCompra: pro.costoCompra[inn][j],
                    // costoMenor: pro.costoMenor[inn][j],
                };
                all_details = [order_pro];
                setDetailsData(all_details);
                setOrder(order_data);
            } else {
                var flag = 0;
                for (var i = 0; i < details_data.length; i++) {
                    if (
                        details_data[i].code === pro.codigo[inn][j] &&
                        details_data[i].parentArray === inn &&
                        details_data[i].childArray === j
                    ) {
                        flag = 1;
                        if(details_data[i].Qty < pro.Stock[inn][j]) {
                            setDetailsData([
                                ...details_data.slice(0, i),
                                {
                                    ...details_data[i],
                                    Qty: details_data[i].Qty + 1,
                                    Total_price: pricing * (details_data[i].Qty + 1),
                                },
                                ...details_data.slice(i + 1, details_data.length),
                            ]);
                            setOrder({
                                ...order,
                                order_product: [
									...details_data.slice(0, i),
									{
										...details_data[i],
										Qty: details_data[i].Qty + 1,
										Total_price: pricing * (details_data[i].Qty + 1),
									},
									...details_data.slice(i + 1, details_data.length),
								],
                                Total_price: order.Total_price + pricing,
                            });
                        } else {
                            setDepositoErr(`El stock es solo ${pro.Stock[inn][j]} en ${pro.deposito.nombre}`)
                        }
                    }
                }
                if (flag === 0) {
                    var order_pro2 = {
                        Qty: 1,
                        Total_price: pricing,
                        code: code,
                        parentArray: inn,
                        childArray: j,
                        Product_id: pro.Product_id,
                        Order_id: order.Order_id,
                    };
                    setDetailsData([...details_data, order_pro2]);
                    setOrder({
                        ...order,
						order_product: [...details_data, order_pro2],
                        Total_price: order.Total_price + pricing,
                    });
                }
            }
        }
    };

    // const loop = useRef(true)
    useEffect(() => {
        var result = []
		// console.log('---------Order----------')
		if (ordering !== null) {
                for (var i = 0; i < ordering.order_product.length; i++) {
                    var pro
                    for (var j = 0; j < Products.length; j++) {
                        // console.log(Products[j].Product_id, details_data[0].order_product[i].Product_id)
                        if (Products[j].Product_id === ordering.order_product[i].Product_id) {
                            pro = Products[j]
                        }
                    }
                    result.push(pro)
                }
		}
		// console.log('Order', ordering, result)
		setProduct(result)

        // console.log(ordering, returned_data, result)
        if(ordering !== null && returned_data !== null) {
			// console.log(order_return?.Total_price - returned_data.Total_price)
            // var price = order_return?.Total_price - returned_data.Total_price
            // order_return.Total_price = price
            setDetailsData(ordering?.order_product.filter(ele => ele.Order_pro_id !== returned_data.Order_pro_id))
            setOrder(ordering)
            setPaymentType(ordering.Tipo_de_Cliente)
            setEmployeeName(ordering.Employee_name)
        } else {
			// setDetailsData(null)
			// setOrder(null)
			// setPaymentType('Compras por Mayor')
            // setEmployeeName('')
		}
    }, [Products, ordering, order, returned_data])

    const returnProduct = async (val, pay=true) => {
        // console.log(ordering, details_data)
		if(ordering.order_product.length === 1) {
			setDetailsData(null)
			setOrder(null)
            setOrdering(null)
            setOrderDetails(null)
			var stock = Products.filter((p) => p.Product_id === ordering.order_product[0].Product_id)[0].Stock
			var total_stock = stock[ordering.order_product[0].parentArray][ordering.order_product[0].childArray] + ordering.order_product[0].Qty
			stock[ordering.order_product[0].parentArray][ordering.order_product[0].childArray] = total_stock
			var req_data = {
				Product_id: ordering.order_product[0].Product_id,
				Stock: JSON.stringify(stock)
			}
			var single_pro = Products.findIndex((p) => p.Product_id === ordering.order_product[0].Product_id)
			Products[single_pro].Stock = stock
			allproduct(Products)
			// console.log(Products[single_pro].Stock)
			if(window.desktop) {
				await window.api.addData(Products, "Products");
			}
			if(Status) {
				await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/product/quantity', req_data)
				await axios.delete(`https://storecontrolserverv2-production-3675.up.railway.app/ordermaster/delete/${ordering.Order_id}`)
				await axios.delete(`https://storecontrolserverv2-production-3675.up.railway.app/orderproduct/delete/${val.Order_pro_id}`)
				.then(async item => {
					await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster')
						.then(async prod => {
							let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
							prod.data.sort(function (d1, d2) {
								return new Date(d2.createdAt) - new Date(d1.createdAt);
							});
							allorders(prod.data)
							if(window.desktop) {
								await window.api.addData(prod.data, "Orders")
							}
							var year = new Date(ordering.createdAt).getFullYear()
							var month = new Date(ordering.createdAt).getMonth()
							var date = new Date(ordering.createdAt).getDate()
							var tot = 0
							for(var q=0; q<prod.data.length; q++) {
								if(new Date(prod.data[q].createdAt).toDateString() === new Date(ordering.createdAt).toDateString()) {
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
							await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity/day', {
								Sales_id: Sales_Activity[index].Sales_id,
								...Sales_Activity[index]
							})
							await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity')
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
			var spec = ordering.order_product.filter(function(x) {return !(x.Order_pro_id === val.Order_pro_id)})
			ordering.order_product = spec
			var prod = product.filter(ele => ele.Product_id !== val.Product_id)
			setDetailsData(details_data)
			setProduct(prod)
			// setOrdering({...ordering, Total_price: ordering.Total_price - val.Total_price})
			if(Status) {
				await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/product/quantity', req_data_el)
                if(pay) {
                    await axios.put(`https://storecontrolserverv2-production-3675.up.railway.app/ordermaster/price`, {
                        Order_id: ordering.Order_id,
                        Total_price: ordering.Total_price - val.Total_price
                    })
                }
				await axios.delete(`https://storecontrolserverv2-production-3675.up.railway.app/orderproduct/delete/${val.Order_pro_id}`)
					.then(async item => {
						await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/ordermaster')
							.then( async prod => {
								let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
								prod.data.sort(function (d1, d2) {
									return new Date(d2.createdAt) - new Date(d1.createdAt);
								});
								allorders(prod.data)
								if(window.desktop) {
									await window.api.addData(prod.data, "Orders")
								}
								var year = new Date(ordering.createdAt).getFullYear()
								var month = new Date(ordering.createdAt).getMonth()
								var date = new Date(ordering.createdAt).getDate()
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
								await axios.put('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity/day', {
									Sales_id: Sales_Activity[index].Sales_id,
									...Sales_Activity[index]
								})
								await axios.get('https://storecontrolserverv2-production-3675.up.railway.app/salesactivity')
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
				ordering.Total_price = ordering.Total_price - val.Total_price
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

    return (
        <div className="employeeorder">
            <div className="container-fluid h-100 d-flex flex-column justify-content-between">
                <div className="row h-100">
                    <div className="col-md-9 d-flex flex-column justify-content-between">
                        <div>
                            <div className="order_list">
                                <OrderList
                                    details_data={details_data}
                                    setDetailsData={setDetailsData}
                                    order={order}
                                    setOrder={setOrder}
                                    componentRef={componentRef}
                                    handlePrint={handlePrint}
                                    paymentType={paymentType}
                                    setPaymentType={setPaymentType}
                                    addorder={addorder}
                                    client_name={client_name}
                                    setClientName={setClientName}
                                    deposito_err={deposito_err}
                                    setDepositoErr={setDepositoErr}
                                    employee_name={employee_name}
                                    setEmployeeName={setEmployeeName}
                                    allpro={allpro} 
                                    setAllPro={setAllPro}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="pay_btn my-2 w-100">
                                <button
                                    className="btn btn_all btn-success w-100"
                                    data-toggle="modal"
                                    data-target="#payorder"
                                    disabled={details_data === null}
                                >
                                    Metodo de Pago
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 flex-1 d-flex flex-column justify-content-between">
                        <div>
                            <div className="new_order_btn my-2">
                                <button className="btn btn_all btn-success w-100" onClick={neworder}>
                                    Nueva Orden
                                </button>
                            </div>
                            {/* <div className="new_product_btn my-2">
                                <NewProduct details_data={productinsert} setDetailsData={setProductInsert} allpro={allpro} setAllPro={setAllPro} />
                            </div> */}
                            <div className="find_product_btn my-2">
                                <button className="btn btn_all btn-primary w-100" data-toggle="modal" data-target="#findproduct">
                                    Buscar Producto
                                </button>
                            </div>
                            <div className="order_history_btn my-2">
                                <button className="btn btn_all btn-info w-100" data-toggle="modal" data-target="#order">
                                    Todas las Ordenes
                                </button>
                            </div>
                            {/* <div className="refund_order_btn my-2">
                                <button className="btn btn_all btn-primary w-100" data-toggle="modal" data-target="#order" onClick={() => setRefund(true)}>
                                    Reembolso Orden
                                </button>
                            </div> */}
                            <div className="print_btn my-2">
                                <button className="btn btn_all btn-primary w-100" onClick={handlePrint}>
                                    Imprimir
                                </button>
                            </div>
                            {/* <div className='print_btn my-2'>
								<button className='btn btn_all btn-primary w-100' data-toggle='modal' data-target='#sendmessage'>Send Message</button>
							</div> */}
                            <div className="my-2">
                                <Notification employee={true} />
                            </div>
                        </div>
                        <div>
                            <div className="cancel_order_btn my-2">
                                <button className="btn btn_all btn-danger w-100" onClick={cancelorder}>
                                    Cancelar Orden
                                </button>
                            </div>
                            <div className="logout_btn my-2">
                                <Link to="/" onClick={() => localStorage.clear()} className="btn btn_all btn-primary w-100 d-flex justify-content-center align-items-center">
                                    Cerrar sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="order" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Registro de Ordenes
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    setOrderDetails(null);
                                    setOrdering(null);
                                    if (refund) setRefund(false);
                                }}
                            >
                                <span aria-hidden="true">
                                    <FontAwesomeIcon icon="close" />
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Orders
                                employee={JSON.parse(localStorage.getItem('DepositoLogin'))?.nombre}
                                setOrderDetails={setOrderDetails}
                                setOrdering={setOrdering}
                                refund={refund}
                                setRefund={setRefund}
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={() => {
                                    if (refund) setRefund(false);
                                }}
                            >
                                Cerrar
                            </button>
                            {/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#'>Edit Productos</button> */}
                        </div>
                    </div>
                </div>
            </div>
            {!refund ? (
                <DetailsOrder
                    details_data={order_details}
                    setDetailsData={setOrderDetails}
                    order={ordering}
                    setOrder={setOrdering}
                    particularOrder={particularOrder}
                    setReturnVal={setReturnVal}
                    product={product}
                />
            ) : null}
            <EditOrder details_data={order_details} particular={particular} />
            <PayOrder details_data={details_data} setDetailsData={setDetailsData} setOrder_Data={setOrder} setOrderReturn={setOrder} order={order} setOrder={setOrder} setReturnedData={setReturnedData} Province={Province} setProvince={setProvince} />
            {/* <AreYouSure returnProduct={returnProduct} return_val={return_val} setReturnedData={setReturnedData} /> */}
            <AreYouSure returnProduct={returnProduct} return_val={return_val} setReturnedData={setReturnedData} name='EmployeeOrder' />
            <SendMessage />
            <FindProduct addorder={addorder} allpro={allpro} setAllPro={setAllPro} />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        DepositoAdd: state.Deposito,
        Sales_Activity: state.Sales_Activity,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
        category: (val) => {
            dispatch({
                type: "CATEGORYADD",
                item: val,
            });
        },
        deposito: (val) => {
            dispatch({
                type: "DEPOSITO",
                item: val,
            });
        },
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeOrder);
