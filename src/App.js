import React, {useEffect, useState} from "react";
import "./App.css";
import {Button, DatePicker, Form, Input, Table} from "antd";
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

const dataSource = [
  {
    key: "1",
    codigo: "982728",
    titulo: "titulo teste 1",
    descricao: "descricao do item 1",
    status: "OK",
    data: maskData("2002-12-30T12:10:50"),
  },
  {
    key: "2",
    codigo: "982729",
    titulo: "titulo teste 2",
    descricao: "descricao do item 2",
    status: "OK",
    data: maskData("2022-01-12T15:10:50"),
  },
  {
    key: "3",
    codigo: "982730",
    titulo: "titulo teste 3",
    descricao: "descricao do item 3",
    status: "OK",
    data: maskData("2023-04-20T16:10:50"),
  },
];

const urlPrincipalAPI = "http://127.0.0.1:5000/tarefa/";

function App() {
  const [dadosTabela, setDadosTabela] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [body, setBody] = useState({
    titulo: "",
    descricao: "",
    data: "",
  })

  const columns = [
    {
      title: "Id",
      dataIndex: "codigo",
      key: "id",
    },
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
    },
    {
      title: "Ação",
      key: "acao",
      render: (e) => (
          <>
            <Button onClick={() => {
              concluirTarefa(e.codigo)
            }}> Concluir </Button>

            <Button onClick={() => {
              deletarTarefa(e.codigo)
            }}> Deletar </Button>
          </>
      ),
    },
  ];

  const concluirTarefa = (id) => {
    alert(`concluir tarefa com id ${id}`)
  }

  const deletarTarefa = (id) => {
    alert(`deletar tarefa com id ${id}`)
  }

  const adicionarTarefa = () => {
    //Adicionar chamada api, quando der 200 atualizado fica true

    const url = urlPrincipalAPI;

    //const body = {...body};

    console.log(body)

    axios.post(url, body).then((res) => {
      fetchData();
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const url = urlPrincipalAPI + "todas";

    axios.get(url).then((res) => {
      console.log(res.data);
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
                    allowClear={false}
                    onOk={(date) => {
                      setBody({...body, data: new Date(date.$d).toISOString()})
                    }}
                />
              </Form.Item>
              <Form.Item>
                <Button onClick={adicionarTarefa}>Adicionar</Button>
              </Form.Item>
            </Form>

            <Table dataSource={dataSource} columns={columns}/>
          </>
        </div>
      </>
  );
}

export default App;
