import React, {useEffect, useState} from "react";
import "./App.css";
import {Button, DatePicker, Form, Input, notification, Table} from "antd";
import axios from "axios";

const {RangePicker} = DatePicker;
const {TextArea} = Input;

const maskData = (v) => {
  var objToday = new Date(v),
      domEnder = (function () {
        var a = objToday;
        if (/1/.test(parseInt((a + "").charAt(0)))) return "0";
        a = parseInt((a + "").charAt(1));
        return 1 === a ? "" : 2 === a ? "" : 3 === a ? "" : "";
      })(),
      dayOfMonth =
          objToday.getDate() < 10
              ? "0" + objToday.getDate() + domEnder
              : objToday.getDate() + domEnder,
      // eslint-disable-next-line no-array-constructor
      months = new Array(
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12"
      ),
      curMonth = months[objToday.getMonth()],
      curYear = objToday.getFullYear(),
      curHour =
          objToday.getHours() > 12
              ? objToday.getHours() - 3
              : objToday.getHours() < 10 && objToday.getHours() > 2
                  ? "0" + objToday.getHours() - 3
                  : objToday.getHours() === 2
                      ? "23"
                      : objToday.getHours() === 1
                          ? "22"
                          : "21",
      curMinute =
          objToday.getMinutes() < 10
              ? "0" + objToday.getMinutes()
              : objToday.getMinutes(),
      curSeconds =
          objToday.getSeconds() < 10
              ? "0" + objToday.getSeconds()
              : objToday.getSeconds();

  var dataFormatadaApi =
      dayOfMonth +
      "/" +
      curMonth +
      "/" +
      curYear +
      " às " +
      curHour +
      ":" +
      curMinute +
      ":" +
      curSeconds;
  return dataFormatadaApi;
};
const urlPrincipalAPI = "http://127.0.0.1:5000/tarefa/";

function App() {
  const [dadosTabela, setDadosTabela] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [body, setBody] = useState({
    titulo: "",
    descricao: "",
    data: "",
  })
  const [listaTarefas, setListaTarefas] = useState([])

  const columns = [
    {
      title: "Título",
      key: "titulo",
      render: (linha) => {
        return linha.status === true ? <div style={{color: "green"}}>{linha.titulo}</div> :
            <div style={{color: "red"}}>{linha.titulo}</div>
      }
    },
    {
      title: "Descrição",
      key: "descricao",
      render: (linha) => {
        return linha.status === true ? <div style={{color: "green"}}>{linha.descricao}</div> :
            <div style={{color: "red"}}>{linha.descricao}</div>
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => status === 'False' ? 'Pendente' : 'Concluida'
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (data) => new Date(data).toLocaleDateString() + " às " + new Date(data).toLocaleTimeString()
    },
    {
      title: "",
      key: "acao_1",
      render: (e) => (
          <>
            <Button onClick={() => {
              concluirTarefa(e.id)
            }}> Concluir </Button>
          </>
      ),
    },
    {
      title: "",
      key: "acao_2",
      render: (e) => (
          <>
            <Button onClick={() => {
              deletarTarefa(e.id)
            }}> Apagar </Button>
          </>
      ),
    },
  ];

  const concluirTarefa = (id) => {
    const url = urlPrincipalAPI + "finalizada/" + id;
    axios.put(url).then((res) => {
      notification.success({message: "Tarefa concluida com sucesso"})
      fetchData();
    })
  }

  const deletarTarefa = (id) => {
    const url = urlPrincipalAPI + "removida/" + id;
    axios.delete(url).then((res) => {
      notification.success({message: "Tarefa removida com sucesso"})
      fetchData();
    })
  }

  const adicionarTarefa = () => {
    //Adicionar chamada api, quando der 200 atualizado fica true

    const url = urlPrincipalAPI + "nova";


    axios.post(url, body).then((res) => {
      setBody({data: new Date(), descricao: "", titulo: ""});
      notification.success({message: "Tarefa adicionada com sucesso"})
      fetchData();
    }).catch(erro => {
      let texto = erro.response.data
      notification.error({message: texto});
    })

  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const url = urlPrincipalAPI + "todas";

    axios.get(url).then((res) => {
      setListaTarefas(res.data);
    });
  };

  return (
      <>
        <div className="App">
          <>
            <p>
              <b>Lista de tarefas</b>
            </p>
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                disabled={componentDisabled}
                style={{maxWidth: 600}}>
              <Form.Item label="Título">
                <Input value={body.titulo} onChange={(e) => {
                  setBody({...body, titulo: e.target.value})
                }}/>
              </Form.Item>
              <Form.Item label="Descrição">
                <Input value={body.descricao} onChange={(e) => {
                  setBody({...body, descricao: e.target.value})
                }}/>
              </Form.Item>
              <Form.Item label="Data & Hora">
                <DatePicker

                    format="DD/MM/YYYY HH:mm"
                    defaultValue={body.data}
                    showTime={{format: 'HH:mm'}}
                    placeholder="Start"
                    allowClear={true}
                    onChange={(date) => {
                      setBody({...body, data: new Date(date.$d).toISOString()})
                    }}
                />
              </Form.Item>
              <Form.Item>
                <Button onClick={adicionarTarefa}>Adicionar</Button>
              </Form.Item>
            </Form>

            <Table dataSource={listaTarefas} columns={columns}/>
          </>
        </div>
      </>
  );
}

export default App;
