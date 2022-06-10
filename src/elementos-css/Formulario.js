import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const colores = {
    borde: "#0075ff",
    error: "#bb2929",
    exito: "#1ed12d",
};

const Formulario = styled.form `
  display: flex;
  grid-template-columns: 1fr;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label `
  display: block;
  font-weight: 700;
  padding: 10px;
  min-height: 40px;
  cursor: pointer;
`;

const Select = styled.select `
  width: 100%;
  height: 35px;
  background: #fff;  
  padding-left: 5px;
  font-size: 14px;
  border-radius: 3px;

  &:focus{
    border: 3px solid ${colores.borde};
    outline: none;
  }
`;

const GrupoInput = styled.div `
  position: relative;
  z-index: 90;
`;

const Input = styled.input `
  width: 100%;
  backgroud: #fff;
  border-radius: 3px;
  height: 45px;
  line-height: 45px;
  padding: 0 40px 0 10px;
  transition: .3s ease all;
  border: 3px solid transparent;

  &:focus{
    border: 3px solid ${colores.borde};
    outline: none;
  }

  ${props => props.valido === 'true' && css`
    border: 3px solid transparent;
  `}

  ${props => props.valido === 'false' && css`
    border: 3px solid ${colores.error} !important;
  `}
`;

const LeyendaError = styled.p `
  font-size: 12px;
  margin-bottom: 0;
  color: ${colores.error};
  display: ${(props) => (props.valido === 'true' ? 'none' : 'block')}; 

  ${props => props.valido === 'true' && css`
    display: none;
  `}

  ${props => props.valido === 'false' && css`
    display: block;
  `}
`;

const IconoValidacion = styled(FontAwesomeIcon)
`
  position: absolute;
  right: 10px;
  bottom: 14px;
  z-index: 100;
  font-size; 16px;
  opacity: 0; 
`;

const Button = styled.button `
  background: transparent;
  border-radius: none;
  border: none;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: .1s ease all;
`;

const MensajeError = styled.div `
  height: 45px;
  line-height: 45px;
  background: #f66060;
  padding: 0 15px
  border-radius: 3px;
  p {
    margin: 0;
  }
`;

export {
    Formulario,
    Label,
    Input,
    GrupoInput,
    LeyendaError,
    IconoValidacion,
    Select,
    Button,
    MensajeError
};