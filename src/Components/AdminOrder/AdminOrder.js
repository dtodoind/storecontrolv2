import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactToPrint } from "react-to-print";

import "./AdminOrder.scss";
import OrderList from "../../Components/OrderList/OrderList";
// import NewProduct from '../../Components/NewProduct/NewProduct'
// import DetailsOrder from "../../Components/DetailsOrder/DetailsOrder";
import Orders from "../../Pages/Orders/Orders";
import EditOrder from "../../Components/EditOrder/EditOrder";
// import { Link } from 'react-router-dom'
import PayOrder from "../../Components/PayOrder/PayOrder";
import AreYouSure from "../../Components/AreYouSure/AreYouSure";
import SendMessage from "../../Components/SendMessage/SendMessage";
import FindProduct from "../FindProduct/FindProduct";
import { connect } from "react-redux";
import ModalProduct from "../ModalProduct/ModalProduct";
// import axios from "axios";
// import { Order_master } from "../../Data/Order_master";
// prettier-ignore
function AdminOrder({ setOrderReturn, setReturnedData, setOrder_Data, returnProduct, return_val, order_return = null, returned_data = null, ...props }) {
    const { Products } = props
	const [allpro, setAllPro] = useState(Products)

	const [details_data, setDetailsData] = useState(null)
	const [order, setOrder] = useState()

	const [order_details, setOrderDetails] = useState(null)
	const [, setOrdering] = useState(null)
	const [particular,] = useState(null)
	
	// const [productinsert, setProductInsert] = useState(null)
	const [paymentType, setPaymentType] = useState('Compras por Mayor')
	const [deposito_err, setDepositoErr] = useState('')
	const [employee_name, setEmployeeName] = useState('')

	const [refund, setRefund] = useState(false)
	const [moreOrder, setMoreOrder] = useState()

	const neworder = () => {
		setDetailsData(null)
		setOrder(null)
	}

	const cancelorder = () => {
		setDetailsData(null)
		setOrder(null)
	}

	// const particularOrder = (index) => {
	// 	setparticular(index)
	// }

	const componentRef = useRef()

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
				setOrder({...order_data, order_product: all_details});
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
						Total_price: details_data?.reduce((acc, value )=> acc + value.Total_price, 0) + pricing,
					});
				}
			}
		}
    };
   

	const loop = useRef(true)

	useEffect(() => {
		// console.log(order_return, returned_data)
        if(order_return !== null && returned_data !== null) {
			// console.log(order_return?.Total_price - returned_data.Total_price)
            // var price = order_return?.Total_price - returned_data.Total_price
            // order_return.Total_price = price
            setDetailsData(order_return?.order_product.filter(ele => ele.Order_pro_id !== returned_data.Order_pro_id))
            setOrder(order_return)
            setPaymentType(order_return.Tipo_de_Cliente)
            setEmployeeName(order_return.Employee_name)
        } else {
			setDetailsData(null)
			setOrder(null)
			setPaymentType('Compras por Mayor')
            setEmployeeName('')
		}
        async function pro_method() {
        }
        if (loop.current) {
            pro_method()
            loop.current = false
        }
    }, [order_return, returned_data])

	return (
		<div className='adminorder'>
			<div className='modal fade' id="adminorder" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Nueva Orden</h5>
                            <button 
                                type="button" 
                                style={{backgroundColor: "transparent", border: 0}} 
                                className="close" 
                                data-dismiss="modal" 
                                aria-label="Close" 
                                onClick={() => {
                                    setDetailsData(null)
									setOrder(null)
                                    // formRef.current.resetForm()
                                }}
                            >
                                <FontAwesomeIcon icon="close"/>
                            </button>
                        </div>
						<div className="modal-body">
							<div className='container-fluid h-100 d-flex flex-column justify-content-between'>
								<div className='row h-100'>
									<div className='col-md-9 d-flex flex-column justify-content-between'>
										<div>
											<div className='order_list'>
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
													deposito_err={deposito_err}
													setDepositoErr={setDepositoErr}
													employee_name={employee_name}
													setEmployeeName={setEmployeeName}
													allpro={allpro} 
													setAllPro={setAllPro}
													setMoreOrder={setMoreOrder}
												/>
											</div>
										</div>
										<div>
											<div className='pay_btn my-2 w-100'>
												<button className='btn btn_all btn-success w-100' data-toggle='modal' data-target='#payorder' disabled={details_data === null}>Pay</button>
											</div>
										</div>
									</div>
									<div className='col-md-3 d-flex flex-column justify-content-between'>
										<div>
											{
												order_return !== null && returned_data !== null
												? null
												: <div className='new_order_btn my-2'>
													<button className='btn btn_all btn-success w-100' onClick={neworder}>Nueva Orden</button>
												</div>
											}
											{/* <div className='new_product_btn my-2'>
												<NewProduct details_data={productinsert} setDetailsData={setProductInsert}  />
											</div> */}
											<div className='find_product_btn my-2'>
												<button className='btn btn_all btn-primary w-100' data-toggle='modal' data-target='#findproduct'>Buscar Producto</button>
											</div>
											{/* <div className='order_history_btn my-2'>
												<button className='btn btn_all btn-info w-100' data-toggle='modal' data-target='#order'>Order History</button>
											</div> */}
											{/* <div className='refund_order_btn my-2'>
												<button className='btn btn_all btn-primary w-100' data-toggle='modal' data-target='#order' onClick={() => setRefund(true)}>Refund Order</button>
											</div> */}
											<div className='print_btn my-2'>
												<button className='btn btn_all btn-primary w-100' onClick={handlePrint}>Print</button>
											</div>
											{/* <div className='print_btn my-2'>
												<button className='btn btn_all btn-primary w-100' data-toggle='modal' data-target='#sendmessage'>Send Message</button>
											</div> */}
										</div>
										<div>
											{
												order_return !== null && returned_data !== null
												? null
												: <div className='cancel_order_btn my-2'>
													<button className='btn btn_all btn-danger w-100' onClick={cancelorder}>Cancel Order</button>
												</div>
											}
											{/* <div className='logout_btn my-2'>
												<Link to='/' className='btn btn_all btn-primary w-100 d-flex justify-content-center align-items-center'>Logout</Link>
											</div> */}
										</div>
									</div>
								</div>
							</div>
							<div className="modal fade" id="order" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
								<div className="modal-dialog modal-dialog-centered" role="document">
									<div className="modal-content">
										<div className="modal-header">
											<h5 className="modal-title" id="exampleModalLabel">Ordene Details</h5>
											<button 
												type="button" 
												className="close" 
												data-dismiss="modal" 
												aria-label="Close" 
												onClick={() => {
													setOrderDetails(null)
													setOrdering(null)
													if(refund) setRefund(false)
												}}
											>
												<span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
											</button>
										</div>
										<div className="modal-body">
											<Orders employee={1} setOrderDetails={setOrderDetails} setOrdering={setOrdering} refund={refund} setRefund={setRefund} />
										</div>
										<div className="modal-footer">
											<button 
												type="button" 
												className="btn btn-secondary" 
												data-dismiss="modal" 
												onClick={() => {
													if(refund) setRefund(false)
												}}
											>Close</button>
											{/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#'>Edit Productos</button> */}
										</div>
									</div>
								</div>
							</div>
							{/* {
								!refund
								? <DetailsOrder name="AdminOrders" details_data={order_details} setDetailsData={setOrderDetails} order={ordering} setOrder={setOrdering} particularOrder={particularOrder} />
								: null
							} */}
							<EditOrder details_data={order_details} particular={particular} />
							<PayOrder details_data={details_data} setDetailsData={setDetailsData} setOrder_Data={setOrder_Data} setOrderDetails={setOrderDetails} order={order} setOrder={setOrder} setOrderReturn={setOrderReturn} returned_data={returned_data} setReturnedData={setReturnedData} returnProduct={returnProduct} return_val={return_val} />
							<ModalProduct addorder={addorder} moreOrder={moreOrder} />
							<AreYouSure />
							<SendMessage />
						</div>
						<div className="modal-footer">
							<button 
								type="button" 
								className="btn btn-secondary" 
								data-dismiss="modal" 
								onClick={() => {
									setDetailsData(null)
									setOrder(null)
                                    setOrderReturn(null)
                                    setReturnedData(null)
									// formRef.current.resetForm()
								}}
								>Close</button>
							{/* <button type="submit" className="btn btn-primary" id='submit'>Save changes</button> */}
						</div>
					</div>
				</div>
			</div>
			<FindProduct addorder={addorder} allpro={allpro} setAllPro={setAllPro} />
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        DepositoAdd: state.Deposito,
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminOrder);
