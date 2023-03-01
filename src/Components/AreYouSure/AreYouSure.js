import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";

import "./AreYouSure.scss";

// prettier-ignore
function AreYouSure({ returnProduct, return_val, setReturnedData, name=null }) {

    const [return_type, setReturnType] = useState()
    const onChange = (e) => {
        setReturnType(e.target.value)
    }

    // useEffect(() => {
    //     var myModalEl = document.getElementById('detailsorder')
    //     console.log(myModalEl)
    //     myModalEl.addEventListener('show.bs.modal', function (event) {
    //         console.log('Add Event Listener')
    //     })

    //     return () => {
    //         myModalEl.removeEventListener('show.bs.modal', function (event) {
    //             console.log('Remove Event Listener')
    //         })
    //     }
    // }, [])

    const Submit = () => {
        // returnProduct(return_val)
        setReturnedData(return_val)
        // var myModalEl = document.getElementById('detailsorder')
        // myModalEl.modal('hide')

        $('#detailsorder').hide()
        $('#order').hide()
        // for(var i=0; i<document.getElementsByClassName('modal fade show').length; i++) {
        //     document.getElementsByClassName('modal fade show')[i].classList.remove('show')
        // }
        // for(var i=0; i<document.getElementsByClassName('modal fade').length; i++) {
        //     document.getElementsByClassName('modal fade')[i].setAttribute('aria-hidden', 'true')
        //     document.getElementsByClassName('modal fade')[i].style.paddingRight = null
        // }
        $('.modal-backdrop').remove();

        // document.getElementsByClassName('modal-backdrop fade show')[0].remove()
        // document.getElementsByClassName('modal-backdrop fade show')[0].remove()
        // document.getElementsByClassName('modal-backdrop')[0].remove()
        // console.log(document.getElementsByClassName('modal-backdrop'))
    }

    return (
        <div className="areyousure">
            <div className="modal fade" id="areyousure" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Opción de devolución
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">
                                    <FontAwesomeIcon icon="close" />
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className='col-md d-flex flex-column justify-content-center align-items-center'>
                                    <label className="form-check-label d-flex flex-column justify-content-center align-items-center" htmlFor="return_pro">
                                        <div>
                                            <FontAwesomeIcon icon="turn-down" fontSize={60} color='red'/>
                                        </div>
                                        <div>
                                            <span style={{fontSize: 20}}>Devolver el Producto</span>
                                        </div>
                                        <input className="form-check-input" type="radio" name="return" value='Devolver el Producto' id="return_pro" onChange={onChange} />
                                    </label>
                                </div>
                                <div className='col-md d-flex flex-column justify-content-center align-items-center'>
                                    <label className="form-check-label d-flex flex-column justify-content-center align-items-center" htmlFor="exchange">
                                        <div>
                                            <FontAwesomeIcon icon="right-left" fontSize={60} color='green'/>
                                        </div>
                                        <div>
                                            <span style={{fontSize: 20}}>Cambiar el Producto</span>
                                        </div>
                                        <input className="form-check-input" type="radio" name="return" value='Cambiar el Producto' id="exchange" onChange={onChange} />
                                    </label>
                                </div>
                            </div>
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
                                            return_type === 'Devolver el Producto'
                                            ? <button type="button" className="btn btn-primary w-100" data-dismiss="modal" onClick={() => returnProduct(return_val)}>
                                                Submit
                                            </button>
                                            : name === 'EmployeeOrder'
                                                ? <button type="button" className="btn btn-primary w-100" data-dismiss="modal" onClick={() => Submit()}>
                                                    Submit
                                                </button>
                                                : <button type="button" className="btn btn-primary w-100" data-dismiss="modal" data-toggle="modal" data-target="#adminorder" onClick={() => Submit()}>
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
    );
}

export default AreYouSure;
