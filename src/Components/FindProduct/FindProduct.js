import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useReactToPrint } from "react-to-print";
// import axios from "axios";

import "./FindProduct.scss";
// import { Products_data } from "../../Data/Products_data";
// import PrintBarcode from "../../Components/PrintBarcode/PrintBarcode";
import TransferStock from "../TransferStock/TransferStock";
import DetailsProduct from "../DetailsProduct/DetailsProduct";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import {
    store_Category,
    store_Clients,
    store_Desposito,
    store_NotifyMaster,
    store_Orders,
    store_Products,
    store_SalesActivity,
} from "../../Functions/AllFunctions";
// import { Categoria } from "../../Data/Categories";

// prettier-ignore
function FindProduct({ addorder, allpro, setAllPro, ...props }) {

	const { Products, CategoryAdd, allproduct, category, deposito, DepositoAdd, Status, Sales_Activity, allsalesactivity, Orders, allorders, Notific, notify, Clients, allClients, filtered_cat } = props

	const [search, setSeatrch] = useState('')
	// const [allpro, setAllPro] = useState(Products)
	const [details_data, setDetailsData] = useState(null)
	const [stocknum, setStockNum] = useState()
	// const [printBar, setPrintBar] = useState([])
	const [co, setCo] = useState()
	const loop = useRef(true)
	// const order_loop = useRef(true)

	const onChange = (e) => {
		setSeatrch(e.target.value)
		var result = []
		if(e.target.value !== '') {
			for (var i = 0; i < Products.length; i++) {
				if (Products[i].nombre.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
					result.push(Products[i])
				}
			}
		} else {
			result = Products
		}
		setAllPro(result)
	}

	const details = (pro) => {
		var index = Products.findIndex((item) => item.Product_id === pro.Product_id)
		setCo(index)
		setDetailsData(pro)
	}

	const stocktransfer = (val) => {
		setStockNum(val)
	}

	// const printRef = useRef()

	// const handlePrint = useReactToPrint({
	// 	content: () => printRef.current,
	// });

	// const checking = (e, val) => {
	// 	if(e.target.checked) {
	// 		setPrintBar([...printBar, val])
	// 	} else {
	// 		setPrintBar(printBar.filter(function(x) {return x.Product_id !== val.Product_id}))
	// 	}
	// }

	useEffect(() => {
		async function pro_method() {
			await store_SalesActivity('FindProduct', Status, Sales_Activity, allsalesactivity)
			await store_Category('FindProduct', Status, CategoryAdd, category)
			await store_Products('FindProduct', Status, Products, allproduct, setAllPro, Sales_Activity, allorders, allsalesactivity, CategoryAdd, filtered_cat)
			await store_Desposito('FindProduct', Status, DepositoAdd, deposito)
			await store_Orders('FindProduct', Status, Orders, allorders, notify)
			await store_NotifyMaster('FindProduct', Status, Notific, notify)
			await store_Clients('FindProduct', Status, Clients, allClients)
        }
		if(loop.current) {
			pro_method()
			loop.current = false
		}
		// if(order_loop.current && Products.length !==0 && Sales_Activity.length !== 0) {
		// 	// store_order()
		// 	order_loop.current = false
		// }
    }, [Products.length, allproduct, category, deposito, CategoryAdd, DepositoAdd, Status, Products, Sales_Activity, allorders, allsalesactivity, setAllPro, Notific, Orders, notify, Clients, allClients, filtered_cat]);

	return(
		<div className='findproduct'>
			<div className="modal fade" id="findproduct" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Find Products</h5>
							<button 
								type="button" 
								className="close" 
								data-dismiss="modal" 
								aria-label="Close" 
								onClick={() => {
									setDetailsData(null)
									// setOrder(null)
								}}
							>
								<span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
							</button>
						</div>
						<div className="modal-body">
							<div className='container-fluid p-0'>
								<div className='row'>
									<div className='col-md text-right my-2'>
										<div className='d-flex justify-content-end'>
											<div className='barcode_all_print d-flex align-items-center'>
												{/* {
													printBar.length === 0 
													? null 
													: <div className='bg-primary text-light p-1 rounded-circle text-center' style={{width:32}}>{printBar.length}</div>
												}
												<button className='btn btn-primary mx-2' onClick={handlePrint}>Print {printBar.length === 0 ? 'All' : 'Selected'} Barcode</button> */}
											</div>
											<div className='search'>
												<input type='text' className='txt_input' placeholder='Search by Nombre' defaultValue={search} onChange={onChange} />
												<button className='btn'>
													<FontAwesomeIcon icon="search" size='lg'/>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='table_overflow'>
								<table className="table table-striped table-hover">
									<thead>
										<tr>
											<th scope="col" className='text-center'>ID</th>
											<th scope="col">Name</th>
											<th scope="col" className='text-center'>Description</th>
											<th scope="col" className='text-center'>Deposito</th>
											<th scope="col" className='text-center'>Categoria</th>
											{/* <th scope="col" className='text-center'>Codigo</th> */}
											{/* <th scope="col" className='text-center'>Stock</th> */}
											{/* <th scope="col" className='text-center'>Precio</th> */}
											{/* <th scope="col" className='text-center'>Fecha</th> */}
											{/* <th scope="col" className='text-center'>Categoria</th> */}
											{/* <th scope="col" className='text-center'>Talles</th> */}
											{/* <th scope="col" className='text-center'>Print Barcode</th> */}
											{/* <th scope="col" className='text-center'>Add</th> */}
										</tr>
									</thead>
									<tbody>
										{
											allpro?.map((pro, index) => 
												JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Master Manager'
												? <tr key={index} style={{cursor: 'pointer'}}>
													<th onClick={() => details(pro)} scope="row" className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{index+1}</th>
													<td onClick={() => details(pro)} className='align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.nombre}</td>
													<td onClick={() => details(pro)} className='align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.description}</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.deposito.nombre}</td>
													<td className={`text-center align-middle update${index}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro, index)}>
														{CategoryAdd?.filter(function (x) {return x.Category_id === pro.Category_id;})[0]?.nombre}
													</td>
													{/* <td className='text-center align-middle' style={{width:25}}>
														<input type='checkbox' onChange={(e) => checking(e, pro)} style={{zIndex: 10}} />
													</td> */}
													{/* <td onClick={() => details(pro)} data-toggle="modal" data-target="#detailsproduct" className={`${pro.stock.filter((item) => item.stocking === 0).length > 0 ? 'bg-danger' : pro.stock.reduce((partialSum, a) => partialSum.stocking + a.stocking, 0) === 0 ? 'bg-danger' : 'bg-success'} text-center text-light align-middle`}>
														{
															pro.stock.reduce((partialSum, a) => partialSum + a.stocking, 0)
														}
													</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">${pro.costoCompra}</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.fecha}</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.categoria}</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.talles}</td>
													<td className='text-center align-middle'><button className='btn btn-primary' data-dismiss='modal' onClick={() => addorder(pro)} disabled={pro.stock <= 0}>Add</button></td> */}
												</tr>
												: JSON.parse(localStorage.getItem('DepositoLogin')).Deposito_id_fk === pro.deposito.Deposito_id || JSON.parse(localStorage.getItem('DepositoLogin')).nombre === pro.deposito.nombre
													? <tr key={index} style={{cursor: 'pointer'}}>
														<th onClick={() => details(pro)} scope="row" className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{index+1}</th>
														<td onClick={() => details(pro)} className='align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.nombre}</td>
														<td onClick={() => details(pro)} className='align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.description}</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.deposito.nombre}</td>
														<td className={`text-center align-middle update${index}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro, index)}>
															{CategoryAdd?.filter(function (x) {return x.Category_id === pro.Category_id;})[0]?.nombre}
														</td>
														{/* <td className='text-center align-middle' style={{width:25}}>
															<input type='checkbox' onChange={(e) => checking(e, pro)} style={{zIndex: 10}} />
														</td> */}
														{/* <td onClick={() => details(pro)} data-toggle="modal" data-target="#detailsproduct" className={`${pro.stock.filter((item) => item.stocking === 0).length > 0 ? 'bg-danger' : pro.stock.reduce((partialSum, a) => partialSum.stocking + a.stocking, 0) === 0 ? 'bg-danger' : 'bg-success'} text-center text-light align-middle`}>
															{
																pro.stock.reduce((partialSum, a) => partialSum + a.stocking, 0)
															}
														</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">${pro.costoCompra}</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.fecha}</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.categoria}</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.talles}</td>
														<td className='text-center align-middle'><button className='btn btn-primary' data-dismiss='modal' onClick={() => addorder(pro)} disabled={pro.stock <= 0}>Add</button></td> */}
													</tr>
													: null
											)
										}
									</tbody>
								</table>
							</div>
						</div>
						<div className="modal-footer">
							<button 
								type="button" 
								className="btn btn-secondary" 
								data-dismiss="modal" 
								onClick={() => {
									setDetailsData(null)
									// setOrder(null)
								}}
							>Close</button>
							{/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#'>Edit Productos</button> */}
						</div>
					</div>
				</div>
			</div>
			{
				useLocation().pathname === '/ordenes'
				? <>
					<DetailsProduct details_data={details_data} setDetailsData={setDetailsData} index={co} addorder={addorder} stocktransfer={stocktransfer} />
					<TransferStock details_data={details_data} stocknum={stocknum} />
				</>
				: null
			}
			{
				useLocation().pathname === '/employeeorder'
				? <>
					<DetailsProduct details_data={details_data} setDetailsData={setDetailsData} index={co} addorder={addorder} stocktransfer={stocktransfer} />
					<TransferStock details_data={details_data} stocknum={stocknum} />
				</>
				: null
			}
			{/* <div style={{display: 'none'}}>
				<PrintBarcode printRef={printRef} printBar={printBar} />
			</div> */}
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        DepositoAdd: state.Deposito,
        Notific: state.NotifyMaster,
        Clients: state.Clients,
        Filtered_cat: state.Filtered_cat,
        Orders: state.Orders,
        Status: state.Status,
        Sales_Activity: state.Sales_Activity,
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
        allClients: (val) => {
            dispatch({
                type: "CLIENTS",
                item: val,
            });
        },
        filtered_cat: (val) => {
            dispatch({
                type: "FILTERED_CAT",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindProduct);
