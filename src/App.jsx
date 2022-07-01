import React, {useState, useEffect} from "react";
import { 
  Formulario, Label, GrupoInput, Input, 
  IconoValidacion, LeyendaError, Select, Button, MensajeError 
} from "./elementos-css/Formulario.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import VentanaModal from "./componentes/VentanaModal.jsx";
import parse from "html-react-parser";


/*TODO: 
  validar la entrada del documento (mensaje de error)
  deshabilitar el checkbox (ligado a aceptar TyC)
  ventana emergente con los TyC (solicitud al back del texto TyC)
  Al cerrar la ventana se llena checkbox y se guarda info del usuario  
*/



function App() {
  const [documento, setDocumento] = useState({campo: '', valido: null});
  const [isChecked, setIsChecked] = useState(false);
  const [select, setSelect] = useState('Cedula');
  const [tyc, setTyc] = useState([]);
  const [validacion, setValidacion] = useState([]);
  const [ventana, setVentana] = useState(false)
  const [deshabilitar, setDeshabilitar] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:8080/terms/ultimo')
      .then(res => {
        console.log(res);
        setTyc(res.data)      
      })
      .catch(error => {
        console.log(error.response)
      });

    axios.get(`http://localhost:9000/validador/${select}`)
      .then(res => {
        console.log(res);
        //console.log(res.data.expresionRegular);
        setValidacion(res.data)      
      })
      .catch(error => {
        console.log(error.response)
      });
  }, [select])  
  
  const onChangeInput = (e) => {
    setDocumento({...documento, campo: e.target.value})
    
  }

  const validacionDocumento = () => {
    if (regex.test(documento.campo)) {
      //console.log("correcto");
      
      setDocumento({ ...documento, valido: 'true' });
    } else {
      //console.log("incorrecto");
      setDocumento({ ...documento, valido: 'false' });
    }
  }  

  /*
  const validacionCedula = () => {
    //console.log(select + " ced");
    if (expresiones.cedula.test(documento.campo)) {
      //console.log("correcto");
      
      setDocumento({ ...documento, valido: 'true' });
    } else {
      //console.log("incorrecto");
      setDocumento({ ...documento, valido: 'false' });
      //console.log(documento.valido)
      //console.log(documento.campo)
    }
  }

  const validacionPassport = () => {
   //console.log(select + " pass");
    if (expresiones.passport.test(documento.campo)) {
      //console.log("correcto");
      //console.log(documento.valido)
      setDocumento({ ...documento, valido: 'true' });
    } else {
      //console.log("incorrecto");
      setDocumento({ ...documento, valido: 'false' });
     // console.log(documento.valido)
      //console.log(documento.campo)
    }
        
}*/

  const handleOnClik = () =>{
    setVentana(!ventana);
    setDeshabilitar(!deshabilitar)
  }

  
  const handleSelect = (e) => {
    setSelect(e.target.value);
    setDocumento({ ...documento, campo: ''});
    console.log(select + " select");
  }

  const handleCancelar = () => {
    setVentana(!ventana);
    setDocumento({ ...documento, campo: ''});
    setDocumento({ ...documento, valido: 'false' });
  }

  const handleSubmit = async () => {    
    //e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8080/terms/aceptar',
        {          
          tipoDocumento: select,
          documento: documento.campo,          
          versionAcep: tyc.version
        }
        
      );
      console.log(res.data)
    } catch (error) {
      console.log(error.response)
    }
    setIsChecked(!isChecked);
    setVentana(!ventana);
    setDeshabilitar(!deshabilitar)
    setDocumento({ ...documento, campo: ''});
  }

  const regex = RegExp(validacion.expresionRegular)    
  
/*
  const expresiones = {
    cedula : /^[0-9]{2}-[PN]{2}-[0-9]{3}-[0-9]{4}$/, //01-PN-012-1234
    passport : /^[a-zA-Z0-9-]{5,16}$/
  }
  */


  //todo probar cambiar el onClick por el onSubmit
  const textoTyC = `${tyc.texto}`;

  return (
    <>
      <Formulario className="App" onSubmit={handleSubmit}>
        <h1> Aceptar Términos y Condiciones </h1> <br />
        <div>
          <Label htmlFor="tipo"> Tipo de documento </Label>
          <Select name="tipo" id="tipo" onChange={handleSelect} >            
          <option value="Cedula"> Cedula </option>
          <option value="Passport"> Pasaporte </option>
          </Select>
        </div>
        <br />
        <div>
          <Label htmlFor="doc"> Documento </Label>
          <GrupoInput>
            <Input 
              required 
              type="text" 
              name="doc"
              placeholder="Ingrese el documento"
              id="doc" 
              value={documento.campo}
              onChange={onChangeInput}
              //onBlur={select === 'Cedula' ? validacionCedula : validacionPassport}
              //onKeyUp={select === 'Cedula' ? validacionCedula : validacionPassport}
              onBlur={validacionDocumento}
              onKeyUp={validacionDocumento}
              valido={documento.valido}
              />            
            
            <IconoValidacion icon={faCheckSquare} />
          </GrupoInput>
          {
            select === 'Cedula' && documento.valido === 'false'  
            ? <LeyendaError> Ingrese un formato de cedula valido (01-PN-012-1234) </LeyendaError>
            : select === 'Passport' && documento.valido === 'false' 
            ? <LeyendaError> El numero del pasaporte debe de contener de 5 a 16 caracteres </LeyendaError>
            : null
          }
          
        </div>
        <br />
        {documento.valido === 'true'  &&
          <Label>
            <input type="checkbox" name="terminos" id="terminos" disabled checked={isChecked}/>  
            <Button type="button" onClick={() => handleOnClik()} >Leer los Terminos y Condiciones</Button>                
          </Label>
        }      
        <VentanaModal
          ventana = {ventana}
          setVentana = {setVentana}
        >
          
          {parse(textoTyC)}
          <br/>
          <Button type="submit" onClick={() => handleSubmit()}>Aceptar</Button>
          <Button type="button" onClick={() => handleCancelar()}>Cancelar</Button>
        </VentanaModal>
        {false && <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationCircle} />
            <b> Error:</b> Por favor diligencie el formulario
          </p>
        </MensajeError>}
      
      </Formulario>
    </>
  );
}

export default App;
