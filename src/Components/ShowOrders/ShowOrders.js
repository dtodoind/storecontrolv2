import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";

import "./ShowOrders.scss";

// prettier-ignore
function ShowOrders({ idModal, details_data, show_data, setShowData, setDetailsData, setOrder, refund=false, ...props }) {

    const { Orders } = props
    // console.log(details_data)

    const [talles, setTalles] = useState('')
    const [color, setColor] = useState(null)
    const [filter_data, setFilter_data] = useState()
    const [search, setSearch] = useState('')

    useEffect(() => {
        setSearch('')
        setFilter_data(show_data)
    }, [show_data])

    const details = (product, pro) => {
		// if (employee === null) {
			setDetailsData(product)
			setOrder(pro)
		// } else {
			// setOrderDetail(product)
			// setOrdering(pro)
		// }
	}

    const changetalles = (e) => {
        setTalles(e.target.value)
        var data = []
        for(var i=0; i<show_data.length; i++) {
            for(var j=0; j<show_data[i].order_product.length; j++) {
                if(show_data[i].order_product[j].Product_id === details_data.Product_id) {
                    if(details_data.Size[show_data[i].order_product[j].parentArray][show_data[i].order_product[j].childArray] === details_data.Size[show_data[i].order_product[j].parentArray][parseInt(e.target.value)]) {
                        data.push(show_data[i])
                    }
                }
            }
        }
        setFilter_data(data)
    }
    const changecolor = (e) => {
        setColor(e.target.value)
        var data = []
        for(var i=0; i<show_data.length; i++) {
            for(var j=0; j<show_data[i].order_product.length; j++) {
                if(show_data[i].order_product[j].Product_id === details_data.Product_id) {
                    if(details_data.Color[show_data[i].order_product[j].parentArray] === details_data.Color[parseInt(e.target.value)]) {
                        data.push(show_data[i])
                    }
                }
            }
        }
        setFilter_data(data)
        setTalles(null)
    }

    const onChange = (e) => {
        setSearch(e.target.value)
        var data = []
        var result = []
        if(color !== null) {
            for(let i=0; i<show_data.length; i++) {
                for(let j=0; j<show_data[i].order_product.length; j++) {
                    if(show_data[i].order_product[j].Product_id === details_data.Product_id) {
                        if(details_data.Size[show_data[i].order_product[j].parentArray] === details_data.Size[color]) {
                            data.push(show_data[i])
                        }
                    }
                }
            }
        } else {
            data = show_data
        }
        if(talles !== '' && data.length !== 0) {
            var new_data = data
            data = []
            for(let i=0; i<new_data.length; i++) {
                for(let j=0; j<new_data[i].order_product.length; j++) {
                    if(new_data[i].order_product[j].Product_id === details_data.Product_id) {
                        if(details_data.Size[new_data[i].order_product[j].parentArray][new_data[i].order_product[j].childArray] === details_data.Size[color][talles]) {
                            data.push(new_data[i])
                        }
                    }
                }
            }
        }
        if (e.target.value !== "") {
            for (var o = 0; o < data.length; o++) {
                if (
                    data[o].Client_name.toUpperCase().indexOf(
                        e.target.value.toUpperCase()
                    ) > -1
                ) {
                    result.push(data[o]);
                }
            }
        } else {
            result = data;
        }
        setFilter_data(result)
    }

    const closing = () => {
        setColor(null)
        setTalles('')
        setShowData(null)
    }

    return (
        <div className='showorders'>
			<div className="modal fade" id={idModal} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Productos Details</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowData(null)}>
								<span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
							</button>
						</div>
						<div className="modal-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <select name="color" className="dropdown" value={color === null ? '' : color} onChange={changecolor}>
                                        <option value="" style={{display: 'none'}} disabled>Color</option>
                                        {
                                            details_data?.Color.map((co, i) => 
                                                co !== ''
                                                ? <option key={co+i} value={i}>{co}</option>
                                                : null
                                            )
                                        }
                                    </select>
                                    <select name="talles" className="dropdown" value={talles === null ? '' : talles} onChange={changetalles}>
                                        <option value="" style={{display: 'none'}} disabled>Talles</option>
                                        {
                                            color !== null
                                            ? details_data?.Size[color].map((si, i) => 
                                                si !== ''
                                                ? <option key={si+i} value={i}>{si}</option>
                                                : null
                                            )
                                            : null
                                        }
                                    </select>
                                </div>
                                <div>
                                    <input type='text' onChange={onChange} value={search} className='input_search' placeholder="Nombre Cliente" />
                                </div>
                            </div>
                            <div className='table_overflow'>
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col" className='text-center'>ID</th>
                                            <th scope="col" className='text-center'>Nombre Cliente</th>
                                            <th scope="col" className='text-center'>Deposito</th>
                                            <th scope="col" className='text-center'>Precio Total</th>
                                            <th scope="col" className='text-center'>Productos Total</th>
                                            <th scope="col" className='text-center' style={{ cursor: 'pointer' }}>
                                                Fecha 
                                                {/* {
                                                    arr === 'desc' 
                                                    ? <FontAwesomeIcon icon="angle-down" style={{ color: 'gray', fontSize: 15 }} /> 
                                                    : <FontAwesomeIcon icon="angle-up" style={{ color: 'gray', fontSize: 15 }} />
                                                } */}
                                                </th>
                                            <th scope="col" className='text-center'>Nombre Vendedor</th>
                                            <th scope="col" className='text-center'>Estado Orden</th>
                                            {/* {
                                                refund
                                                    ? <th scope="col" className='text-center'>Reembolso</th>
                                                    : null
                                            } */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filter_data?.map((pro, index) =>
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
                                                        {
                                                        pro?.Order_status === 'Paid' ? (
                                                            <span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>Cobrado</span>
                                                        ) : (
                                                            <span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>A cobrar</span>
                                                        )

                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closing}>Close</button>
							{/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#newproduct'>Edit Productos</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
    );
}

const mapStateToProps = (state) => {
    return {
        Orders: state.Orders,
    };
};

export default connect(mapStateToProps)(ShowOrders);
