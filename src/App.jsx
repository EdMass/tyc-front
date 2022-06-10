import React, {useState, useEffect} from "react";
import { 
  Formulario, Label, GrupoInput, Input, 
  IconoValidacion, LeyendaError, Select, Button, MensajeError 
} from "./elementos-css/Formulario.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


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
  const [tyc, setTyc] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/terms/ultimo')
      .then(res => {
        console.log(res);
        setTyc(res.data)      
      })
      .catch(error => {
        console.log(error.response)
      })
  }, [])
  
  
  const opcionesTipo = [
    {
      "nombre" : "Cedula"
    },
    {
      "nombre" : "Passport"
    }
  ]

  const onChangeInput = (e) => {
    setDocumento({...documento, campo: e.target.value})
    
  }

  const validacionCedula = () => {
    console.log(select + " ced");
    if (expresiones.cedula.test(documento.campo)) {
      console.log("correcto");
      
      setDocumento({ ...documento, valido: 'true' });
    } else {
      console.log("incorrecto");
      setDocumento({ ...documento, valido: 'false' });
      console.log(documento.valido)
      console.log(documento.campo)
    }
  }

  const validacionPassport = () => {
   console.log(select + " pass");
    if (expresiones.passport.test(documento.campo)) {
      console.log("correcto");
      console.log(documento.valido)
      setDocumento({ ...documento, valido: 'true' });
    } else {
      console.log("incorrecto");
      setDocumento({ ...documento, valido: 'false' });
      console.log(documento.valido)
      console.log(documento.campo)
    }
        
}

  const handleOnClik = () =>{
    setIsChecked(!isChecked)
  }

  
  const handleSelect = (e) => {
    setSelect(e.target.value);
    console.log(select + " select");
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const expresiones = {
    cedula : /^[0-9]{2}-[PN]{2}-[0-9]{3}-[0-9]{4}$/, //01-PN-012-1234
    passport : /^[a-zA-Z0-9-]{5,16}$/
  }

  return (
    <>
      <Formulario className="App" onSubmit={handleSubmit}>
        <h1> Términos y Condiciones </h1> <br />
        <div>
          <Label htmlFor="tipo"> Tipo de documento </Label>
          <Select name="tipo" id="tipo" onChange={handleSelect} >            
            {
              opcionesTipo.map((item , i) => (
                <option key={"tipo"+i} value={i} > {item.nombre}  </option>
              ))
            }
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
              onBlur={select === 'Cedula' ? validacionCedula : validacionPassport}
              onKeyUp={select === 'Cedula' ? validacionCedula : validacionPassport}
              valido={documento.valido}
              />            
            
            <IconoValidacion icon={faCheckSquare} />
          </GrupoInput>
          {
            select === 'Cedula' && documento.valido === 'false'  
          }
          <LeyendaError>Esto es un parrafo</LeyendaError>
        </div>
        <br />
        <Label>
          <input type="checkbox" name="terminos" id="terminos" disabled checked={isChecked}/>          
          <Button type="submit" onClick={() => handleOnClik()}  >Aceptar los Terminos y Condiciones</Button>
        </Label>
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
