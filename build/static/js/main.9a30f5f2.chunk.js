(this.webpackJsonpminesweeper=this.webpackJsonpminesweeper||[]).push([[0],{184:function(e,t,n){},185:function(e,t,n){},25:function(e,t,n){e.exports={itemCell:"Game_itemCell__3FOuh",blownUpBackground:"Game_blownUpBackground__1mZmd",activeUser:"Game_activeUser__FM9DR",activeMove:"Game_activeMove__3SzOP",unclickableTable:"Game_unclickableTable__1oNBt",itemHistory:"Game_itemHistory__3uVux",wrapMain:"Game_wrapMain__2CyV-",backgroundred:"Game_backgroundred__3BH2P",backgroundblue:"Game_backgroundblue__3FxOl",backgroundgreen:"Game_backgroundgreen__37hOm",backgroundyellow:"Game_backgroundyellow__2f-3w",backgroundbrown:"Game_backgroundbrown__1qPyH",backgroundpink:"Game_backgroundpink__1EVOL",backgroundpurple:"Game_backgroundpurple__1jmdg",backgroundorange:"Game_backgroundorange___23lW",backgrounddarkred:"Game_backgrounddarkred__2jbRx",backgrounddarkgreen:"Game_backgrounddarkgreen__2mg6X"}},310:function(e,t,n){},340:function(e,t,n){"use strict";n.r(t);var a=n(1),s=n.n(a),r=n(74),o=n.n(r),i=(n(184),n(15)),c=n(16),l=n(18),u=n(17),m=(n(185),n(11)),d=n(14),p=n(10),j=n(12),g=n(152),b=n(13),O=n.n(b),h=n(24),f=n(2),x=n(77),v="/",I=x.create({baseURL:v});I.interceptors.request.use((function(e){var t=JSON.parse(localStorage.getItem("user"))?JSON.parse(localStorage.getItem("user")).token:"";return t?e.headers.Authorization=t:delete I.defaults.headers.common.Authorization,e}),(function(e){return Promise.reject(e)}));var y=function(e){return I.get("game/".concat(e))},S=function(e,t){return x.post("".concat(v,"login"),{password:e,userName:t})},w=function(e,t){return console.log(e,t),x.post("".concat(v,"users"),{password:e,userName:t})},_=n(41),N="SET_AUTH_USER_DATA",R="SET_IS_CONNECTED",k={userId:null,userName:null,token:null,isConnected:!1},E=function(e,t,n){return{type:N,data:{userId:e,userName:t,token:n}}},M=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:k,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case N:return Object(f.a)(Object(f.a)({},e),t.data);case R:return Object(f.a)(Object(f.a)({},e),{},{isConnected:!0});default:return e}},T=n(151),G="SET_SOCKET",A="SET_USERS_TO_ROOM",C="SET_ROOMS",L="SET_IN_ROOM",D="SET_ID_ROOM",P="SET_ROOM_HISTORY",V="UPDATE_MESSAGE",U="RESET_ROOM_HISTORY",B="SET_IS_MOUNTED",H="SET_IS_SOCKET",Q="SET_IS_CONNECTED",Y="SET_IS_DISCONNECTED",J="SET_IS_RENDER",F={socket:null,users:[],rooms:[],inRoom:null,idRoom:null,roomHistory:[],isMounted:!1,isOneRendered:!1,isSocketExist:!1,isConnected:!1,isDisconnected:!1,isRender:!1},W=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:F,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case G:return Object(f.a)(Object(f.a)({},e),{},{socket:t.socket});case J:return Object(f.a)(Object(f.a)({},e),{},{isRender:t.isRender});case H:return Object(f.a)(Object(f.a)({},e),{},{isSocketExist:t.isSocketExist});case Y:return alert(t.isDisconnected),Object(f.a)(Object(f.a)({},e),{},{isDisconnected:t.isDisconnected});case Q:return Object(f.a)(Object(f.a)({},e),{},{isConnected:!0});case B:return Object(f.a)(Object(f.a)({},e),{},{isMounted:!0,isOneRendered:!1});case D:return Object(f.a)(Object(f.a)({},e),{},{idRoom:t.idRoom});case U:return Object(f.a)(Object(f.a)({},e),{},{roomHistory:[]});case V:var n=JSON.parse(JSON.stringify(e.roomHistory)),a=!1;console.log("clone",n),n.forEach((function(e){var n=e.text.split(" ");console.log("arrText",n),(n[0]===t.userName&&"joined"===n[1]||n[1]&&n[1]===t.userName)&&(a=!0)}));var s=n[n.length-1]&&n[n.length-1].text.split(" ");return!t.message&&e.roomHistory.length>=0&&!a||0===n.length||s[2]&&"left"===s[2]&&s[1]===t.userName?(console.log("cloneclone",n),n.push({name:"admin",text:"Welcome, ".concat(t.userName)}),Object(f.a)(Object(f.a)({},e),{},{roomHistory:n})):t.message?(n.push(t.message),console.log("action.message",t.message),console.log("clone",n),Object(f.a)(Object(f.a)({},e),{},{roomHistory:n})):e;case C:return Object(f.a)(Object(f.a)({},e),{},{rooms:t.rooms});case P:if(console.log("ACTION, ACTION",t.roomId),console.log("ACTION, ACTION",e.idRoom),e.idRoom&&e.idRoom!==t.roomId)return Object(f.a)({},e);if(console.log("ACTION, ACTION",t),console.log("ACTION_HISTORY",t.history),console.log("STATE",e.roomHistory),1===t.history.length)return e;var r=t.history[t.history.length-1].text.split(" ");return r[1]&&"joined"===r[1]&&r[0]==="".concat(t.userName)&&t.history.pop(),console.log("[wordsLastHistory]",r),Object(f.a)(Object(f.a)({},e),{},{roomHistory:t.history,isOneRendered:!0});case L:return Object(f.a)(Object(f.a)({},e),{},{inRoom:t.inRoom});case A:return Object(f.a)(Object(f.a)(Object(f.a)({},e),e.users),{},{users:t.users});default:return e}},q="OPEN_MODAL",z="CLOSE_MODAL",Z={isOpen:!1,content:null},X=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Z,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case q:return Object(f.a)(Object(f.a)({},e),{},{isOpen:!0,content:t.content});case z:return Object(f.a)(Object(f.a)({},e),{},{isOpen:!1});default:return e}};function K(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e+1))+e}var $=function(e,t,n){for(var a=[],s=0;s<e;s++){var r=K(0,+t-1),o=K(0,+n-1);a.push({firstCoordinate:r,lastCoordinate:o})}return a},ee=n(25),te=n.n(ee),ne=n(42),ae="SET_GAME_INFO",se="SET_TABLE",re="CHECK_CELL",oe="FIND_MINE",ie="SET_GAME",ce="SET_GAMES_LIST",le="SET_USERS_IN_ROOM",ue="SET_USERS_LIST_READINESS",me="SET_GAME_OVER",de="SET_WIN",pe="SET_INFORMATION_GAME",je="SET_SURRENDERED",ge="SET_LIST_VIEWERS",be="SET_LIST_LOGS",Oe="SET_PLAYER_STATS",he="SET_ALL_USERS_IN_ROOM",fe="SET_IS_READY",xe={gameInfo:null,tableTwoDimensional:[],isGameOver:!1,gamesList:[],usersInRoom:{},usersInGame:[],usersReadiness:[],gameOwner:{},win:!1,informationGame:!1,surrendered:!1,listViewers:[],listLogs:[],playerStats:[],isReady:!1},ve=function(e){return{type:fe,data:e}},Ie=function(e){return{type:ae,gameInfo:e}},ye=function(e){return{type:pe,gameInfo:e}},Se=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:xe,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case ie:return Object(f.a)(Object(f.a)({},e),{},{tableTwoDimensional:t.game});case he:return Object(f.a)(Object(f.a)({},e),{},{usersInRoom:t.usersInRooms});case fe:return Object(f.a)(Object(f.a)({},e),{},{isReady:t.data.isReady});case je:return Object(f.a)(Object(f.a)({},e),{},{surrendered:t.surrendered});case ge:return Object(f.a)(Object(f.a)({},e),{},{listViewers:t.listViewers});case be:return Object(f.a)(Object(f.a)({},e),{},{listLogs:t.listLogs});case ue:var n=[],a=Object.keys(t.data.listReadiness);return a.forEach((function(e){var a=Object(f.a)({},t.data.listReadiness[e]);console.log("obj",a),a.tabid=e,n.push(a)})),console.log("gameOwner",t.data.gameOwner),Object(f.a)(Object(f.a)({},e),{},{usersReadiness:n,gameOwner:t.data.gameOwner});case ce:return Object(f.a)(Object(f.a)({},e),{},{gamesList:t.gamesList});case pe:return Object(f.a)(Object(f.a)({},e),{},{informationGame:t.gameInfo});case me:return Object(f.a)(Object(f.a)({},e),{},{isGameOver:t.data.blownUp});case Oe:return Object(f.a)(Object(f.a)({},e),{},{playerStats:t.playerStats});case de:return Object(f.a)(Object(f.a)({},e),{},{win:t.data.win});case le:var s=JSON.parse(JSON.stringify(e.usersInRoom));return console.log("action.data1",t.data),0==t.data.usersUniq.length?Object(f.a)({},e):(s[t.data.gameid]=t.data.usersUniq.length,console.log("usersInRoom_REDUCER",s),Object(f.a)(Object(f.a)({},e),{},{usersInRoom:s}));case ae:return Object(f.a)(Object(f.a)({},e),{},{gameInfo:t.gameInfo});case re:var r=[],o=JSON.parse(JSON.stringify(e.tableTwoDimensional));if(o[t.i][t.j].isMine)return Object(f.a)({},e);if(0!==o[t.i][t.j].amountOfMines)return o[t.i][t.j].isOpen=!0,Object(f.a)(Object(f.a)({},e),{},{tableTwoDimensional:o});for(r.push(o[t.i][t.j]);r.length>0;){var i=r.shift();console.log("ELEMENT",i),console.log("clonedTableTwoDimensional",o),o[i.i][i.j].isOpen=!0;for(var c=0;c<3;c++)for(var l=0;l<3;l++)o[i.i-1+c]&&o[i.i-1+c][i.j-1+l]&&(0===o[i.i-1+c][i.j-1+l].amountOfMines&&!1===o[i.i-1+c][i.j-1+l].isOpen&&r.push(o[i.i-1+c][i.j-1+l]),o[i.i-1+c][i.j-1+l].isOpen=!0)}return Object(f.a)(Object(f.a)({},e),{},{tableTwoDimensional:o});case oe:var u=JSON.parse(JSON.stringify(e.tableTwoDimensional));return u[t.i][t.j].isOpen=!0,u[t.i][t.j].isMine&&(u[t.i][t.j].isBlownUp=!0),Object(f.a)(Object(f.a)({},e),{},{tableTwoDimensional:u,isGameOver:u[t.i][t.j].isMine});case se:for(var m=1,d=e.gameInfo.fieldSize.split("x"),p=$(e.gameInfo.minesAmount,+d[1],+d[0]),j=+d[0],g=[],b=1;b<=d[1];b++){for(var O=[],h=m;h<=j;h++)O.push({isMine:!1,isOpen:!1,isChecked:!1});m+=+d[0],j+=+d[0],g.push(O)}p.forEach((function(e){g[e.firstCoordinate][e.lastCoordinate].isMine=!0}));for(var x=0;x<g.length;x++)for(var v=0;v<g[x].length;v++){g[x][v].i=x,g[x][v].j=v;var I=0;g[x][v].isMine||(g[x][v-1]&&g[x][v-1].isMine?I+=1:I+=0,g[x][v+1]&&g[x][v+1].isMine?I+=1:I+=0,g[x-1]&&g[x-1][v].isMine?I+=1:I+=0,g[x+1]&&g[x+1][v].isMine?I+=1:I+=0,g[x+1]&&g[x+1][v-1]&&g[x+1][v-1].isMine?I+=1:I+=0,g[x+1]&&g[x+1][v+1]&&g[x+1][v+1].isMine?I+=1:I+=0,g[x-1]&&g[x-1][v+1]&&g[x-1][v+1].isMine?I+=1:I+=0,g[x-1]&&g[x-1][v-1]&&g[x-1][v-1].isMine?I+=1:I+=0),g[x][v].amountOfMines=I}return Object(f.a)(Object(f.a)({},e),{},{tableTwoDimensional:g});default:return e}},we=Object(j.c)({auth:M,socketPage:W,modalPage:X,gamePage:Se,form:T.a}),_e=Object(j.e)(we,Object(j.a)(g.a)),Ne=n(52),Re=n(0),ke=["component"],Ee=function(e){var t=e.children;return Object(Re.jsx)("div",{children:t})},Me=function(e){var t=e.component,n=Object(Ne.a)(e,ke);return Object(Re.jsx)(m.b,Object(f.a)(Object(f.a)({},n),{},{render:function(e){return Object(Re.jsx)(Ee,{children:Object(Re.jsx)(t,Object(f.a)({},e))})}}))},Te=["component"],Ge=function(e){var t=e.children;return Object(Re.jsx)("div",{children:t})},Ae=function(e){var t=e.component,n=Object(Ne.a)(e,Te);return Object(Re.jsx)(m.b,Object(f.a)(Object(f.a)({},n),{},{render:function(e){return Object(Re.jsx)(Ge,{children:Object(Re.jsx)(t,Object(f.a)({},e))})}}))},Ce=n(149),Le=n(150),De=n(78),Pe=n.n(De),Ve=["input","meta"],Ue=function(e){var t=e.input,n=e.meta,a=Object(Ne.a)(e,Ve),s=n.touched&&n.error;return Object(Re.jsxs)("div",{className:Pe.a.formControl+""+(s?Pe.a.error:""),children:[Object(Re.jsx)("div",{children:Object(Re.jsx)("input",Object(f.a)(Object(f.a)({className:Pe.a.padding},t),a))}),n.touched&&n.error&&Object(Re.jsx)("span",{children:"Field is required"})]})},Be=function(e){if(!e)return"Field is required"},He=n(7),Qe=n.n(He),Ye="data:image/png;base64,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",Je=n(44),Fe=Object(Le.a)({form:"register"})((function(e){return Object(Re.jsx)("div",{className:Qe.a.container,children:Object(Re.jsxs)("div",{className:Qe.a.wrap,children:[Object(Re.jsx)("div",{children:Object(Re.jsx)("h1",{className:Qe.a.title,children:"Sign up your account"})}),Object(Re.jsxs)("form",{onSubmit:e.handleSubmit,children:[Object(Re.jsx)(Ce.a,{placeholder:"User name",name:"userName",validate:[Be],component:Ue}),Object(Re.jsx)(Ce.a,{placeholder:"Password",name:"password",type:"password",validate:[Be],component:Ue}),Object(Re.jsx)(Ce.a,{placeholder:"Repeat password",name:"repeatPassword",type:"password",validate:[Be],component:Ue}),e.error&&Object(Re.jsx)("div",{className:Qe.a.formError,children:e.error}),Object(Re.jsx)("div",{children:Object(Re.jsx)("input",{value:"Sign up",type:"submit",className:"".concat(Qe.a.padding," ").concat(Qe.a.marginButton)})}),Object(Re.jsx)("div",{className:Qe.a.topBorderItem,children:Object(Re.jsx)(d.b,{to:"/login",className:Qe.a.itemText,children:Object(Re.jsx)("span",{children:"Do you already have an account? Sign in"})})})]})]})})})),We=Object(p.b)((function(e){return{userData:e.auth}}),{register:function(e,t,n){return function(){var a=Object(h.a)(O.a.mark((function a(s){var r,o;return O.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(a.prev=0,e!==n){a.next=8;break}return a.next=4,w(e,t);case 4:"OK"===(r=a.sent).statusText?(s(Object(_.a)("register")),alert("you have registered")):(o=r.data.messages.length>0?r.data.messages[0]:"Some error",alert(o)),a.next=9;break;case 8:alert("Password mismatch");case 9:a.next=14;break;case 11:a.prev=11,a.t0=a.catch(0),alert(a.t0.response.data.message);case 14:case"end":return a.stop()}}),a,null,[[0,11]])})));return function(e){return a.apply(this,arguments)}}()}})((function(e){var t=function(){var t=Object(h.a)(O.a.mark((function t(n){return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.register(n.password,n.userName,n.repeatPassword);case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return e.userData.token?Object(Re.jsx)(m.a,{to:"/"}):Object(Re.jsxs)("div",{className:Qe.a.wrapMain,children:[Object(Re.jsx)("div",{title:"Home",className:Qe.a.exit,children:Object(Re.jsx)(d.b,{to:"/",children:Object(Re.jsx)(ne.a,{className:"".concat(Qe.a.marginHome," fa-lg"),icon:Je.b})})}),Object(Re.jsxs)("div",{className:Qe.a.wrapper,children:[Object(Re.jsx)("div",{className:Qe.a.wrapImg,children:Object(Re.jsx)("img",{className:Qe.a.img,src:Ye,alt:""})}),Object(Re.jsx)("div",{className:Qe.a.wrapTitle,children:Object(Re.jsx)("h1",{children:"Messenger"})})]}),Object(Re.jsx)(Fe,{onSubmit:t})]})})),qe=Object(Le.a)({form:"login"})((function(e){return Object(Re.jsx)("div",{className:Qe.a.container,children:Object(Re.jsxs)("div",{className:Qe.a.wrap,children:[Object(Re.jsx)("div",{children:Object(Re.jsx)("h1",{className:Qe.a.title,children:"Enter"})}),Object(Re.jsxs)("form",{onSubmit:e.handleSubmit,children:[Object(Re.jsx)(Ce.a,{placeholder:"Email",name:"userName",validate:[Be],component:Ue}),Object(Re.jsx)(Ce.a,{placeholder:"Password",name:"password",type:"password",validate:[Be],component:Ue}),Object(Re.jsx)("div",{children:Object(Re.jsx)("input",{value:"Sign in",type:"submit",className:"".concat(Qe.a.padding," ").concat(Qe.a.marginButton)})}),Object(Re.jsx)("div",{className:Qe.a.topBorderItem,children:Object(Re.jsx)(d.b,{to:"/register",className:Qe.a.itemText,children:Object(Re.jsx)("span",{children:"Sign up your account"})})})]})]})})})),ze=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(i.a)(this,n);for(var a=arguments.length,s=new Array(a),r=0;r<a;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).onSubmit=function(){var t=Object(h.a)(O.a.mark((function t(n){return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.props.login(n.password,n.userName);case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e}return Object(c.a)(n,[{key:"componentWillUnmount",value:function(){}},{key:"render",value:function(){return Object(Re.jsxs)("div",{className:Qe.a.wrapMain,children:[Object(Re.jsx)("div",{title:"Home",className:Qe.a.exit,children:Object(Re.jsx)(d.b,{to:"/",children:Object(Re.jsx)(ne.a,{className:"".concat(Qe.a.marginHome," fa-lg"),icon:Je.b})})}),Object(Re.jsxs)("div",{className:Qe.a.wrapper,children:[Object(Re.jsx)("div",{className:Qe.a.wrapImg,children:Object(Re.jsx)("img",{className:Qe.a.img,src:Ye,alt:""})}),Object(Re.jsx)("div",{className:Qe.a.wrapTitle,children:Object(Re.jsx)("h1",{children:"Messenger"})})]}),Object(Re.jsx)(qe,{onSubmit:this.onSubmit})]})}}]),n}(s.a.Component),Ze=Object(p.b)((function(e){return{userData:e.auth}}),{login:function(e,t){return function(){var n=Object(h.a)(O.a.mark((function n(a){var s,r,o,i,c,l;return O.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,S(e,t);case 3:s=n.sent,console.log(s),"OK"===s.statusText?(a(Object(_.a)("register")),r=s.data,o=r.userId,i=r.userName,c=r.token,a(E(o,i,c)),l={userId:o,userName:i,token:c,timestamp:Date.now()},console.log(1),window.localStorage.setItem("user",JSON.stringify(l))):s.data.messages.length>0?s.data.messages[0]:"Some error",n.next=11;break;case 8:n.prev=8,n.t0=n.catch(0),console.log("err",n.t0);case 11:case"end":return n.stop()}}),n,null,[[0,8]])})));return function(e){return n.apply(this,arguments)}}()}})(ze),Xe=(n(310),function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){return Object(i.a)(this,n),t.call(this,e)}return Object(c.a)(n,[{key:"render",value:function(){var e=this.props.modalPage,t=e.isOpen,n=e.content;return t?Object(Re.jsx)("div",{className:"modal",children:Object(Re.jsx)("div",{className:"modal-dialog",children:Object(Re.jsxs)("div",{className:"modal-content",children:[Object(Re.jsxs)("div",{className:"modal-header",children:[Object(Re.jsx)("h5",{className:"modal-title",children:n.props.title}),Object(Re.jsx)("button",{type:"button",className:"close",children:Object(Re.jsx)("span",{children:"\xd7"})})]}),n]})})}):null}}]),n}(s.a.Component)),Ke=Object(p.b)((function(e){return{modalPage:e.modalPage}}),{})(Xe),$e=[{name:"9x9",level:"Beginner"},{name:"9x9",level:"Intermediate"},{name:"9x9",level:"Expert"},{name:"16x16",level:"Beginner"},{name:"16x16",level:"Intermediate"},{name:"16x16",level:"Expert"},{name:"30x16",level:"Beginner"},{name:"30x16",level:"Intermediate"},{name:"30x16",level:"Expert"}],et={Beginner:15,Intermediate:27,Expert:50},tt=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).onChangeGameName=function(e){a.setState({gameName:e.target.value})},a.onChangeFieldSize=function(e){var t=e.target.value.split("x");console.log(t),a.setState({fieldSize:"".concat(t[0],"x").concat(t[1]),minesAmount:t[2]})},a.onChangeMaxPlayers=function(e){a.setState({maxPlayers:+e.target.value})},a.onChangeMinesAmount=function(e){a.setState({minesAmount:+e.target.value})},a.createGame=function(){console.log(a.state),a.props.socket.emit("game/create",{gameInfo:a.state},(function(e){}))},a.calcMines=function(e,t){var n=e.split("x");return Math.round(n[0]*n[1]*et[t]/100)},a.state={fieldSize:"3x3",gameName:"",maxPlayers:10,minesAmount:1},a}return Object(c.a)(n,[{key:"render",value:function(){var e=this;return Object(Re.jsxs)("div",{children:[Object(Re.jsxs)("div",{className:"modal-body",children:[Object(Re.jsx)("input",{value:this.state.gameName,onChange:this.onChangeGameName,placeholder:"game name",type:"text"}),Object(Re.jsxs)("select",{defaultValue:"DEFAULT",onChange:this.onChangeFieldSize,name:"select",children:[Object(Re.jsx)("option",{value:"DEFAULT",disabled:!0,children:"Choose field size"}),$e.map((function(t,n){return Object(Re.jsxs)("option",{value:"".concat(t.name,"x").concat(e.calcMines(t.name,t.level)),children:[t.name," mines: ",e.calcMines(t.name,t.level)," ",t.level]},n)}))]}),Object(Re.jsx)("input",{value:this.state.maxPlayers,onChange:this.onChangeMaxPlayers,placeholder:"max players (1-10)",type:"text"})]}),Object(Re.jsx)("button",{onClick:function(){e.createGame()},children:"Create game"}),Object(Re.jsx)("div",{className:"modal-footer",children:Object(Re.jsx)("button",{type:"button",className:"btn btn-secondary",onClick:function(){return e.props.closeModal()},children:"Close"})})]})}}]),n}(s.a.Component),nt=Object(m.g)(Object(p.b)((function(e){return{socket:e.socketPage.socket}}),{closeModal:function(){return{type:z}},setGameInfoAndSetTable:function(e){return function(){var t=Object(h.a)(O.a.mark((function t(n){return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n(Ie(e)),n({type:se});case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},setGameInfo:Ie})(tt)),at=n(80),st=n.n(at),rt=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(i.a)(this,n);for(var a=arguments.length,s=new Array(a),r=0;r<a;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).joinToGame=function(t){e.props.setIsReady({isReady:!1}),e.props.socket.emit("game/join",{gameId:t},(function(e){}))},e.joinToGameAsViewer=function(t){e.props.socket.emit("game/join",{gameId:t,isViewer:!0},(function(e){}))},e}return Object(c.a)(n,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this;return Object(Re.jsxs)("div",{className:st.a.wrapper,children:[Object(Re.jsx)("div",{className:st.a.leftItem,children:Object(Re.jsx)(d.b,{to:"/profile",children:"Profile"})}),Object(Re.jsx)("div",{children:this.props.userName}),Object(Re.jsxs)("div",{className:st.a.rightItem,children:[Object(Re.jsx)("button",{onClick:function(){e.props.openModal(Object(Re.jsx)(nt,{title:"TITLE",id:33333,text:"TESTEST"}))},children:"Open modal"}),Object(Re.jsx)(Ke,{}),"HOME",Object(Re.jsxs)("div",{children:[Object(Re.jsx)("span",{children:"LIST OF ACTIVE GAMES"}),Object(Re.jsx)("div",{children:this.props.gamesList.filter((function(e){return!e.isfinished})).map((function(t){return Object(Re.jsxs)("div",{children:[Object(Re.jsxs)("button",{onClick:function(){e.joinToGame(t.gameid)},children:[Object(Re.jsxs)("span",{children:["Name: ",t.gamename," "]}),Object(Re.jsxs)("span",{children:["Field: ",t.fieldsize," "]}),Object(Re.jsxs)("span",{children:["Players: ",e.props.usersInRoom[t.gameid],"/",t.maxplayers," "]}),Object(Re.jsxs)("span",{children:["Mines: ",t.amountofmines," "]}),t.isplaying?Object(Re.jsx)("span",{children:"Live"}):Object(Re.jsx)("span",{children:"Pending"})]}),Object(Re.jsx)("button",{onClick:function(){e.joinToGameAsViewer(t.gameid)},children:"Join as Viewer"})]})}))})]})]})]})}}]),n}(s.a.Component),ot=Object(m.g)(Object(p.b)((function(e){return{gamesList:e.gamePage.gamesList,socket:e.socketPage.socket,usersInRoom:e.gamePage.usersInRoom,userName:e.auth.userName}}),{openModal:function(e){return{type:q,content:e}},setIsReady:ve})(rt)),it=["red","blue","green","yellow","brown","pink","purple","orange","darkred","darkgreen"],ct=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).onReady=function(){a.props.socket.emit("game/readiness",{isReady:!0,gameId:a.props.match.params.gameId},(function(e){})),a.setState({isReady:!0})},a.onNotReady=function(){a.props.socket.emit("game/readiness",{isReady:!1,gameId:a.props.match.params.gameId},(function(e){})),a.setState({isReady:!1})},a.startGame=function(){a.props.socket.emit("game/start",{gameId:a.props.match.params.gameId}),a.props.getInfoGame(a.props.match.params.gameId)},a.onSurrender=function(){a.props.socket.emit("game/surrender",{gameId:a.props.match.params.gameId})},a.onShowHistory=function(e){a.props.socket.emit("game/showHistory",{action:e})},a.onExitFromGame=function(){a.props.socket.emit("game/exit"),a.props.history.push("/")},a.state={isGaming:!0,isRender:!1,isReady:!1},a}return Object(c.a)(n,[{key:"render",value:function(){var e=this;console.log("this.props.usersReadiness",this.props.usersReadiness),console.log("this.props.informationGame.isplaying",this.props.informationGame);this.props.isGameOver;var t=this.props.tableTwoDimensional&&this.props.tableTwoDimensional.map((function(t,n){var a=t.map((function(t,a){return Object(Re.jsxs)("td",{onClick:function(){!function(t,n){e.props.socket.emit("game/action",{i:t,j:n},(function(e){}))}(n,a)},className:" ".concat(t.isBlownUp&&te.a.blownUpBackground," ").concat(t.isOpen&&!t.isMine&&0!==t.amountOfMines&&te.a["background"+it[t.userId%10]]," ").concat(t.isOpen&&!t.isMine&&0===t.amountOfMines&&te.a["background"+it[t.userId%10]]," ").concat(te.a.itemCell),children:[" ",t.isMine&&t.isBlownUp?Object(Re.jsx)(ne.a,{icon:Je.a}):t.isOpen&&!t.isMine&&t.amountOfMines>0&&t.amountOfMines," "]},a)}));return Object(Re.jsxs)("tr",{children:[" ",a," "]},n)})),n=this.props.gamesList.filter((function(t){return t.gameid===e.props.match.params.gameId})),a=this.props.usersReadiness.find((function(e){return!e.isReady}));this.props.usersReadiness.find((function(e){return e.movePosition}));return Object(Re.jsxs)("div",{className:te.a.wrapMain,children:[Object(Re.jsx)("div",{children:this.props.userName}),Object(Re.jsxs)("div",{className:te.a.itemBlockLeft,children:[this.props.isGameOver&&Object(Re.jsx)("div",{children:"GAME OVER"}),this.props.win&&Object(Re.jsx)("div",{children:"YOU ARE WINNER"}),Object(Re.jsx)("table",{children:t}),!this.props.surrendered&&this.props.informationGame.isplaying&&Object(Re.jsx)("button",{onClick:function(){e.onSurrender()},children:"Surrender"}),Object(Re.jsxs)("div",{children:["list players:",this.props.usersReadiness.map((function(e){return Object(Re.jsx)("div",{className:"".concat(e.isReady&&te.a.activeUser," ").concat(e.movePosition&&te.a.activeMove),children:e.username})}))]}),this.props.listViewers.length>0&&Object(Re.jsxs)("div",{children:["list viewers: ",this.props.listViewers.map((function(e){return e.username}))," "]}),n[0]&&Object(Re.jsxs)("div",{children:["Players: ",this.props.usersInRoom[this.props.match.params.gameId],"/",n[0].maxplayers]}),this.props.informationGame.isplaying||this.props.surrendered?"":this.props.gameOwner&&this.props.gameOwner.username!==JSON.parse(localStorage.getItem("user")).userName?this.props.isReady?Object(Re.jsx)("button",{onClick:function(){e.onNotReady()},children:"Not ready"}):Object(Re.jsx)("button",{onClick:function(){e.onReady()},children:"Ready"}):"",this.props.informationGame.isplaying||a?"":n[0]&&n[0].owner==JSON.parse(localStorage.getItem("user")).userId&&Object(Re.jsx)("button",{onClick:function(){e.startGame()},children:"START GAME"}),Object(Re.jsx)("button",{onClick:function(){e.onExitFromGame()},children:"Exit from game"})]}),Object(Re.jsx)("div",{className:te.a.itemBlockRight,children:this.props.listLogs.map((function(t){return Object(Re.jsx)("div",{children:Object(Re.jsxs)("button",{onClick:function(){e.onShowHistory(t.history)},className:te.a.itemHistory,children:[t.username," i: ",t.history.i,"; j: ",t.history.j," value: ",t.amountofmines]})})}))})]})}}]),n}(s.a.Component),lt=Object(m.g)(Object(p.b)((function(e){return{gameInfo:e.gamePage.gameInfo,tableTwoDimensional:e.gamePage.tableTwoDimensional,isGameOver:e.gamePage.isGameOver,socket:e.socketPage.socket,gamesList:e.gamePage.gamesList,usersInRoom:e.gamePage.usersInRoom,usersInGame:e.gamePage.usersInGame,usersReadiness:e.gamePage.usersReadiness,gameOwner:e.gamePage.gameOwner,win:e.gamePage.win,informationGame:e.gamePage.informationGame,surrendered:e.gamePage.surrendered,listViewers:e.gamePage.listViewers,listLogs:e.gamePage.listLogs,isReady:e.gamePage.isReady,userName:e.auth.userName}}),{checkCell:function(e,t){return{type:re,i:e,j:t}},findMine:function(e,t){return{type:oe,i:e,j:t}},getInfoGame:function(e){return function(){var t=Object(h.a)(O.a.mark((function t(n){var a;return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,y(e);case 3:a=t.sent,console.log("responseresponse",a),"OK"===a.statusText?n(ye(a.data)):a.data.messages.length>0?a.data.messages[0]:"Some error",t.next=12;break;case 8:t.prev=8,t.t0=t.catch(0),alert(t.t0.response.data.message),console.log("err",t.t0.response.data.message);case 12:case"end":return t.stop()}}),t,null,[[0,8]])})));return function(e){return t.apply(this,arguments)}}()}})(ct));var ut=s.a.createContext(),mt=ut.Provider,dt=(ut.Consumer,a.Component,n(154)),pt=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={isRender:!1},a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(e,t,n){var a=this;if(this.props.token&&!this.props.isRender){var s;console.log("RENDER");var r=(s=Object(dt.io)(v,{query:{tabId:JSON.parse(sessionStorage.getItem("tabId")),loggeduser:this.props.token}})).emit.bind(s);s.emit=function(){for(var e,t=arguments.length,n=new Array(t),a=0;a<t;a++)n[a]=arguments[a];return(e=console).log.apply(e,["Socket <=:"].concat(n)),r.apply(void 0,n)},s.on("connect",(function(){console.log("sockett_ID",s.id),a.props.setSocket(s)})),s.on("game/new",(function(e){a.props.setGame({game:e.dataTable}),a.props.setListLogs([]),a.props.setSurrendered(!1),a.props.setWin({win:!1}),a.props.setGameOver({blownUp:!1}),a.props.setListViewers([]),e.game?(e.game.isplaying||e.game.isfinished)&&a.props.history.push("/game/".concat(e.gameId)):a.props.history.push("/game/".concat(e.gameId))})),s.on("game/action",(function(e){a.props.setGame({game:e.dataTable,isMine:e.isMine})})),s.on("game/list",(function(e){a.props.setGamesList(e)})),s.on("game/refresh",(function(e){(e.game.isplaying||e.game.isfinished)&&a.props.history.push("/game/".concat(e.gameId))})),s.on("game/users",(function(e){a.props.setUsersInRoom(e)})),s.on("game/delete/byOwner",(function(e){e.gameDeletedByOwner&&a.props.history.push("/")})),s.on("game/isReady",(function(e){console.log("game_isReady",e),a.props.setIsReady(e)})),s.on("game/listReadiness",(function(e){a.props.setUsersListReadiness(e)})),s.on("game/win",(function(e){a.props.setWin(e)})),s.on("game/blownUp",(function(e){a.props.setGameOver(e)})),s.on("game/info",(function(e){a.props.setInformationGame(e.game)})),s.on("game/surrendered",(function(e){a.props.setSurrendered(e.surrendered)})),s.on("game/listViewers",(function(e){a.props.setListViewers(e.listViewers)})),s.on("game/playerStats",(function(e){a.props.setPlayerStats(e.playerStats)})),s.on("game/listLogs",(function(e){a.props.setListLogs(e.history)})),s.on("game/set/users",(function(e){a.props.setListUsersInRoom(e)})),this.props.setIsRender(!0)}}},{key:"render",value:function(){if(console.log("render"),!JSON.parse(sessionStorage.getItem("tabId"))){var e=Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);window.sessionStorage.setItem("tabId",JSON.stringify(e))}return this.props.token?this.props.token?Object(Re.jsx)(m.a,{to:"/"}):void 0:Object(Re.jsx)(m.a,{to:"/login"})}}]),n}(s.a.Component),jt=Object(m.g)(Object(p.b)((function(e){return{token:e.auth.token,isRender:e.socketPage.isRender}}),{setSocket:function(e){return{type:G,socket:e}},setGame:function(e){var t=e.game,n=e.isMine;return{type:ie,game:t,isMine:void 0===n?void 0:n}},setIsRender:function(e){return{type:J,isRender:e}},setGamesList:function(e){return{type:ce,gamesList:e}},setUsersInRoom:function(e){return{type:le,data:e}},setUsersListReadiness:function(e){return{type:ue,data:e}},setGameOver:function(e){return{type:me,data:e}},setWin:function(e){return{type:de,data:e}},setInformationGame:ye,setSurrendered:function(e){return{type:je,surrendered:e}},setListViewers:function(e){return{type:ge,listViewers:e}},setListLogs:function(e){return{type:be,listLogs:e}},setPlayerStats:function(e){return{type:Oe,playerStats:e}},setListUsersInRoom:function(e){return{type:he,usersInRooms:e}},setIsReady:ve})(pt)),gt=n(81),bt=n.n(gt),Ot=Object(p.b)((function(e){return{userName:e.auth.userName,userId:e.auth.userId,socket:e.socketPage.socket,playerStats:e.gamePage.playerStats}}),{})((function(e){Object(a.useEffect)((function(){e.socket&&e.socket.emit("game/getPlayerStats")}),[]);var t=e.playerStats.filter((function(t){return t.userid==e.userId}));return console.log("playerStat",t),Object(Re.jsxs)("div",{className:bt.a.mainWrap,children:[Object(Re.jsx)(d.b,{to:"/",className:bt.a.leftItem,children:"Home"}),Object(Re.jsxs)("div",{className:bt.a.rightItem,children:[Object(Re.jsxs)("div",{children:["Name: ",e.userName]}),Object(Re.jsxs)("div",{children:["Amount of loss: ",t[0]?t[0].lossamount:0]}),Object(Re.jsxs)("div",{children:["Amount of win : ",t[0]?t[0].winamount:0]})]})]})})),ht=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(i.a)(this,n);for(var a=arguments.length,s=new Array(a),r=0;r<a;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).checkConnection=function(){if(JSON.parse(localStorage.getItem("user"))){var t=JSON.parse(localStorage.getItem("user"));t.timestamp>Date.now()-36e5?e.props.setAuthUserData(t.userId,t.userName,t.token):(window.localStorage.removeItem("user"),e.props.setAuthUserData(null,null,null))}else e.props.setAuthUserData(null,null,null)},e}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.checkConnection(),setInterval((function(){console.log(111),e.checkConnection()}),1e3)}},{key:"render",value:function(){return Object(Re.jsxs)("div",{className:"App",children:[Object(Re.jsx)(jt,{}),Object(Re.jsxs)(m.d,{children:[Object(Re.jsx)(Me,{exact:!0,path:"/profile",component:Ot}),Object(Re.jsx)(Me,{exact:!0,path:"/",component:ot}),Object(Re.jsx)(Me,{exact:!0,path:"/game/:gameId",component:lt}),Object(Re.jsx)(Ae,{path:"/register",component:We}),Object(Re.jsx)(Ae,{path:"/login",component:Ze})]})]})}}]),n}(s.a.Component),ft=Object(j.d)(Object(p.b)((function(e){return{}}),{setAuthUserData:E}))(ht),xt=function(){return console.log(),Object(Re.jsx)(d.a,{children:Object(Re.jsx)(p.a,{store:_e,children:Object(Re.jsx)(ft,{})})})},vt=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,341)).then((function(t){var n=t.getCLS,a=t.getFID,s=t.getFCP,r=t.getLCP,o=t.getTTFB;n(e),a(e),s(e),r(e),o(e)}))};o.a.render(Object(Re.jsx)(s.a.StrictMode,{children:Object(Re.jsx)(xt,{})}),document.getElementById("root")),vt()},7:function(e,t,n){e.exports={wrapTitle:"Login_wrapTitle__3hRKY",wrap:"Login_wrap__TMPVm",wrapper:"Login_wrapper__1IflB",exit:"Login_exit__3j5JG",marginHome:"Login_marginHome__2iQ22",img:"Login_img__33gA4",wrapImg:"Login_wrapImg__282Sf",wrapperInput:"Login_wrapperInput__3mb5v",padding:"Login_padding__2cOuo",buttonWrap:"Login_buttonWrap__2jWor",wrapMain:"Login_wrapMain__1n1s3",tmp:"Login_tmp__2sIJy",title:"Login_title__bh47u",marginButton:"Login_marginButton__2WSu0",itemText:"Login_itemText___yCLq",topBorderItem:"Login_topBorderItem__3_Nzv"}},78:function(e,t,n){e.exports={"form-control":"FormsControl_form-control__je6oX",formControl:"FormsControl_formControl__1-Rgj",error:"FormsControl_error__33y84",padding:"FormsControl_padding__cqm4z"}},80:function(e,t,n){e.exports={itemCreate:"Home_itemCreate__TqfL_",wrapper:"Home_wrapper__299gS",leftItem:"Home_leftItem__1S0VV",rightItem:"Home_rightItem__Zj43E"}},81:function(e,t,n){e.exports={mainWrap:"Profile_mainWrap__2XKu8",leftItem:"Profile_leftItem__35Yk2",rightItem:"Profile_rightItem__WYCdx"}}},[[340,1,2]]]);
//# sourceMappingURL=main.9a30f5f2.chunk.js.map