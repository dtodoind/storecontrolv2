import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./ModalProduct.scss";

// prettier-ignore
function ModalProduct({addorder, moreOrder}) {

    const [statePro, setStatePro] = useState('Product')
    const [exhibit, setExhibit] = useState(true)
    const [option, setOption] = useState()
    const [index_pro, setIndex_pro] = useState()
    const [error, setError] = useState(false)

    const pro_select = (e) => {
        e.preventDefault()
        if(option) {
            if(statePro === 'Product' || exhibit) {
                for(var i=0; i<moreOrder[index_pro].scan.Color.length; i++) {
                    // console.log('condition', moreOrder[index_pro].scan.Color[i].split(' (').length > 1, moreOrder[index_pro].scan.Color[i])
                    if(moreOrder[index_pro].scan.Color[i].split(' (').length > 1) {
                        setExhibit(false)
                        setStatePro('Exhibit')
                        break
                    } else {
                        setExhibit(true)
                        setStatePro('Product')
                    }
                }
            }
        } else {
            setError(true)
        }
    }

    return (
        <div className="modalproduct">
            <div className="modal fade" id="modalproduct" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Seleccionar producto
                            </h5>
                            <button type="button" className="close" 
                                onClick={() => {
                                    document.getElementById('modalproduct').style.display = 'none'
                                    document.getElementById('modalproduct').classList.remove('show')
                                    document.getElementById('modalproduct').setAttribute('aria-hidden', 'true')
                                    setStatePro('Product')
                                    setExhibit(true)
                                }}
                            >
                                <span aria-hidden="true">
                                    <FontAwesomeIcon icon="close" />
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {
                                statePro === 'Product'
                                ? <>
                                    <div className="mb-3">
                                        <span style={{fontWeight: 600, fontSize: 20}}>Todos estos productos tienen el mismo código de barras, seleccione uno</span>
                                    </div>
                                    {
                                        moreOrder?.map((order, i) => 
                                            order.scan.Color[order.h].split(' (').length < 2
                                            ? <div className='d-flex justify-content-center align-items-center' key={i}>
                                                <label className={`w-100 form-check-label d-flex justify-content-between align-items-center ${option !== undefined && option === order.scan.Color[order.h] ? 'form-check-label-active' : null}`} htmlFor={order.scan.Color[order.h]}>
                                                    <div className="mr-3">
                                                        <div><span style={{fontWeight: '600'}}>Nombre: {order.scan.nombre}</span></div>
                                                        <div><span style={{fontWeight: '600'}}>Color: {order.scan.Color[order.h]}</span></div>
                                                        <div><span style={{fontWeight: '600'}}>Size: {order.scan.Size[order.h][order.r]}</span></div>
                                                    </div>
                                                    <input className="form-check-input" type="radio" name="pro" value={order.scan.Color[order.h]} id={order.scan.Color[order.h]} 
                                                        onChange={(e) => {
                                                            setOption(e.target.value)
                                                            setIndex_pro(i)
                                                            setError(false)
                                                            for(var j=0; j<moreOrder.length; j++) {
                                                                if(moreOrder[j].scan.Color[moreOrder[j].h].split(' (').length > 1 && moreOrder[j].scan.Color[moreOrder[j].h].split(' (')[0] === order.scan.Color[order.h]) {
                                                                    setExhibit(true)
                                                                    break
                                                                } else {
                                                                    setExhibit(false)
                                                                }
                                                            }
                                                        }} 
                                                    />
                                                </label>
                                            </div>
                                            : null
                                        )
                                    }
                                </>
                                : <>
                                    <div className="mb-3">
                                        <span style={{fontWeight: 600, fontSize: 20}}>¿Qué producto es?</span>
                                    </div>
                                    <div className="row">
                                        <div className='col-md d-flex flex-column justify-content-center align-items-center'>
                                            <label className="form-check-label d-flex flex-column justify-content-center align-items-center" htmlFor="Exhibit">
                                                <div style={{textAlign: 'center'}}>
                                                    <span style={{fontSize: 20}}>Exhibit</span>
                                                </div>
                                                <input className="form-check-input" type="radio" name="ex" value='Exhibit' id="Exhibit" 
                                                    onChange={(e) => {
                                                        for(var k=0; k<moreOrder.length; k++) {
                                                            if(moreOrder[k].scan.Color[moreOrder[k].h].split(' (').length > 1 && moreOrder[k].scan.Color[moreOrder[k].h].split(' (')[0] === option) {
                                                                setIndex_pro(k)
                                                                break
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <div className='col-md d-flex flex-column justify-content-center align-items-center'>
                                            <label className="form-check-label d-flex flex-column justify-content-center align-items-center" htmlFor="Not Exhibit">
                                                <div style={{textAlign: 'center'}}>
                                                    <span style={{fontSize: 20}}>Not Exhibit</span>
                                                </div>
                                                <input className="form-check-input" type="radio" name="ex" value='Not Exhibit' id="Not Exhibit"/>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            }
                            {error ? <span style={{color: 'red'}}>Required</span> : null}
                        </div>
                        <div className="modal-footer">
                            <div className="container-fluid m-0">
                                <div className="row">
                                    {/* <div className="col p-0">
                                        <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => return_type === 'Devolver el Producto' ? returnProduct(return_val) : Submit()}>
                                            No
                                        </button>
                                    </div> */}
                                    {/* <div className="col p-0"> */}
                                        {
                                            error || exhibit
                                            ? <button type="button" className="btn btn-primary" onClick={pro_select}>
                                                Submit
                                            </button>
                                            : <button type="button" className="btn btn-primary" 
                                                onClick={(e) => {
                                                    pro_select(e)
                                                    document.getElementById('modalproduct').style.display = 'none'
                                                    document.getElementById('modalproduct').classList.remove('show')
                                                    document.getElementById('modalproduct').setAttribute('aria-hidden', 'true')
                                                    setStatePro('Product')
                                                    addorder(moreOrder[index_pro].scan, moreOrder[index_pro].barc, moreOrder[index_pro].h, moreOrder[index_pro].r)
                                                }}
                                            >
                                                Submit
                                            </button>
                                        }
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalProduct;
