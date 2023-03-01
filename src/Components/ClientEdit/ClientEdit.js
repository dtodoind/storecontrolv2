import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Inputbox from "../Inputbox/Inputbox";
import Dropdown from "../Dropdown/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import { Form, Formik } from "formik";
import { connect } from "react-redux";
import axios from "axios";

// prettier-ignore
function ClientEdit({ idModal = "client_edit", Province, setCurrentUser, currentUser, ...props }) {

    const { Clients, allclients, Status } = props;
    const editformRef = useRef();

    const validate = (values) => {
        const errors = {};
        if (!values.Nombre) errors.Nombre = "Required";
        if (!values.Number) errors.Number = "Required";
        if (!values.PaisE) errors.PaisE = "Required";
        if (!values.Province) errors.Province = "Required";

        return errors;
    };

    const initialValues = {
        Nombre: currentUser ? currentUser?.nombre : '',
        Number: currentUser ? currentUser?.number : '',
        PaisE: currentUser ? currentUser?.Country : '',
        Province: currentUser ? currentUser?.Provincia : '',
    };

    const onSubmit = async (values, { resetForm }) => {
        if (Status) {
            await axios.put("https://storecontrolserverv2-production.up.railway.app/register/edit", {
                id: currentUser.id,
                nombre: values.Nombre,
                number: values.Number,
                Country: values.PaisE,
                Provincia: values.Province,
            })
                .then(async (item) => {
                    var m = Clients;
                    var index = Clients.findIndex(ele => ele.id === currentUser.id)
                    m[index] = {
                        ...currentUser,
                        nombre: values.Nombre,
                        number: values.Number,
                        Country: values.PaisE,
                        Provincia: values.Province,
                    }
                    setCurrentUser(m[index])
                    allclients(m)

                    if (window.desktop) {
                        await window.api.addData(m, "Clients")
                    }

                    resetForm()
                    // var client_edit = document.getElementById("client_edit");
                    // client_edit.classList.remove("show");
                    // client_edit.style.display = 'none'
                    // client_edit.ariaHidden = 'true'
                    // var client_editbackdrop = document.getElementsByClassName("modal-backdrop")[0];
                    // client_editbackdrop.remove()
                }).catch(err => console.log(err))
        }  
    };

    const settingval = (name, val) => {
        editformRef.current.setFieldValue(name, val);
    };

    return (
        <div className="newclient">
            <div className="modal fade" id={idModal} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Editar Cliente</h5>
                            <button
                                type="button"
                                style={{ backgroundColor: "transparent", border: 0 }}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    editformRef.current.resetForm()
                                }}
                            >
                                <FontAwesomeIcon icon="close" />
                            </button>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validate={validate}
                            onSubmit={onSubmit}
                            enableReinitialize={true}
                            innerRef={editformRef}
                        >
                            {(props) => (
                                <Form>
                                    <div className="modal-body">


                                        <div className="container-fluid">
                                            <div className="row">

                                                <div className="col-4 d-flex align-items-center">
                                                    <span>Nombre</span>
                                                </div>
                                                <div className="col-8 d-flex align-items-center">
                                                    <Inputbox type="text" name="Nombre" placeholder="Nombre" />
                                                </div>
                                                <div className="col-4 d-flex align-items-center">
                                                    <span>Celular</span>
                                                </div>
                                                <div className="col-8 d-flex align-items-center">
                                                    <Inputbox type="text" name="Number" placeholder="Celular" />
                                                </div>
                                                <div>
                                                    <Dropdown name='PaisE' onChange={settingval} dropvalues={['Argentina']} value_select={props.values.PaisE} touched={props.touched.PaisE} errors={props.errors.PaisE} />
                                                </div>
                                                <div>
                                                    <Dropdown name='Province' onChange={settingval} dropvalues={Province?.provincias?.map((item) => item.nombre)} value_select={props.values.Province} touched={props.touched.Province} errors={props.errors.Province} />
                                                </div> 

                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type='submit' className="btn btn-primary" data-toggle="modal" data-target="#client_edit">
                                            Guardar
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        Status: state.Status,
        Clients: state.Clients,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        allclients: (val) => {
            dispatch({
                type: "CLIENTS",
                item: val,
            });
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ClientEdit);
