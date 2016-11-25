import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
import { createStore, compose, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import $ from "jquery";

var todo = function (state, action) {
  if (state) {
    var items = state.items;
    var i;
  }
  switch (action.type) {
    case "add":
      items.push({ text: action.text, active: true })
      state.name = "hello"
      var newstate = $.extend(true, {}, state);
      return newstate;
    case "delete":
      items.splice(action.text, 1);
      return Object.assign({}, state, { items: [...items] });
    case "editshow":
      for (i = 0; i < items.length; i++) {
        if (i === action.id) {
          items[i].editshow = true;
        } else {
          items[i].editshow = false;
        }
      }
      state.edittext = action.text;
      return Object.assign({}, state, { items: [...items] });
    case "canceledit":
      for (i = 0; i < items.length; i++) {
        items[i].editshow = false;
      }
      return Object.assign({}, state, { items: [...items] });
    case "getedittext":
      state.edittext = action.text;
      return state;
    case "edit":
      for (i = 0; i < items.length; i++) {
        if (i === action.id) {
          items[i].text = state.edittext;
        }
      }
      state.edittext = "";
      return Object.assign({}, state, { items: [...items] });
    case "changeactive":
      for(i=0;i<items.length;i++){
        if(i===action.id){
          items[i].active = !items[i].active;
        }
      }
      return Object.assign({},state,{items:[...items]});
    case "settype":
      state.type=action.typevalue;
      return Object.assign({}, state, { items: [...items] });
    default:
      return {
        name: "todomvc",
        type:"all",
        edittext:"",
        items: [{ text: "aaa", active: true, editshow: false }, { text: "a", active: false, editshow: false }]
      }
  }

}
var reducer = combineReducers({ todo: todo });
var store = createStore(reducer, compose(
  window.devToolsExtension()
));

var AppView = React.createClass({
  render: function () {
    var This = this;
    var items = this.props.items;
    
    
    var lis = items.map(function (o, i) {
      var li_style={};
      if(This.props.type === "all"){
        li_style={
          display:"block"
        }
      }else if(This.props.type === "active"){
        li_style={
          display:o.active?"block":"none"
        }
      }else if(This.props.type === "complate"){
        li_style={
          display:o.active?"none":"block"
        }
      }
      return (
        <li key={o.text + i} style={li_style}><p onClick={()=>{This.changeactive(i,o.active)}} style={{textDecoration:o.active?"none":"line-through"}}>{o.text}</p><button onClick={() => { This.deletehandle(i) } }>删除</button><button onClick={() => { This.editshow(i, o.text) } }>修改</button>
          <div style={{ display: o.editshow ? "block" : "none" }}><input defaultValue={o.text} onChange={(e) => { This.getedittext(e, i) } } /><button onClick={() => { This.edithandle(i) } }>确认</button><button onClick={This.canceledit}>取消</button></div>
        </li>
      )
    });

    return (
      <div>
        <h1>{this.props.name}</h1>
        <input ref="input" />
        <button onClick={this.addHandle}>增加</button>
        <ul>
          {lis}
        </ul>
        <button onClick={()=>{this.settype("all")}}>all</button><button onClick={()=>{this.settype("active")}}>active</button><button onClick={()=>{this.settype("complate")}}>complate</button>
      </div>
    )
  },
  addHandle: function () {
    var input = this.refs.input;
    var value = ReactDOM.findDOMNode(input).value;
    if (value !== "") {
      this.props.dispatch({
        type: "add",
        text: value
      });
      input.value = "";
    }
  },
  deletehandle: function (i) {
    this.props.dispatch({
      type: "delete",
      text: i
    })
  },
  editshow: function (i, txt) {
    this.props.dispatch({
      type: "editshow",
      id: i,
      text: txt
    });
  },
  canceledit: function () {
    this.props.dispatch({
      type: "canceledit",
    });
  },
  getedittext: function (e, i) {
    var newtext = e.target.value;
    this.props.dispatch({
      type: "getedittext",
      text: newtext,
      id: i
    });
  },
  edithandle: function (i) {
    this.props.dispatch({
      type: "edit",
      id: i
    });
    this.canceledit();
  },
  changeactive:function(i,active){
    this.props.dispatch({
      type:"changeactive",
      id:i
    });
  },
  settype:function(type){
    this.props.dispatch({
        type:"settype",
        typevalue:type
    });
  }
});
function mapStore2Props(store) {
  return {
    items: store.todo.items,
    name: store.todo.name,
    editshow: store.todo.editshow,
    type:store.todo.type
  }
}
var Container = connect(mapStore2Props)(AppView);

var App = React.createClass({
  render: function () {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
});



export default App;
