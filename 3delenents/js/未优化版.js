

(function(){
    let oList = document.querySelector("#list ul");

    /*布局函数提前定义*/
    let Grid = function (index){
        /*先求坐标*/
        let x = index % 5;//除以5的余数
        let y = Math.floor(index%25/5);//除以5的商
        let z = Math.floor(index/25);//除以25的商

        /*与中间点求差值*/
        let x_ = x - 2;
        let y_ = y - 2;
        let z_ = 2 - z;

        /*改变位置 水平方向每一份位置300，垂直方向每一份位置400，z方向间隔1000*/
        return `transform:translate3d(${x_*300}px,${y_*400}px,${z_*1000}px);`
    };
    let Helix = (function(){
        let deg = 360/(125/4);
        return function (index){
            return `transform:rotateY(${index*deg}deg) translate3d(0px,${(index-62)*10}px,800px)`
        };
    })();
    let Sphere = (function(){
        let arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1];
        let len = arr.length;
        let xDeg_ = 180/(len-1);//每一层x旋转度数的增量
        return function (index){
            let quan,ge;
            let sum = 0;
            for (let i=0;i<len;i++){
                sum += arr[i];
                if (sum >= (index+1)){
                    //当前元素在arr的第 i 圈（i是arr的序号）
                    quan = i;
                    //当前元素在第 i 圈的第几个（也是序号）
                    ge = arr[i] - (sum-(index+1)) - 1;

                    break;
                }
            }
            let xDeg = 90 - quan*xDeg_;
            let yDeg = 360/arr[quan] * ge + arr[quan]*10;

            return `transform:rotateY(${yDeg}deg) rotateX(${xDeg}deg) translateZ(1000px)`
        }
    })();
    let Table = (function(){
        let coordinate = [
            {x:0,y:0},
            {x:17,y:0},
            {x:0,y:1},
            {x:1,y:1},
            {x:12,y:1},
            {x:13,y:1},
            {x:14,y:1},
            {x:15,y:1},
            {x:16,y:1},
            {x:17,y:1},
            {x:0,y:2},
            {x:1,y:2},
            {x:12,y:2},
            {x:13,y:2},
            {x:14,y:2},
            {x:15,y:2},
            {x:16,y:2},
            {x:17,y:2}
        ];
        return function (index){
            let x,y;
            if (index < 18){
                x = coordinate[index].x;
                y = coordinate[index].y;
            }else if(index<90){
                x = index % 18;
                y = Math.floor(index/18) + 2;
            }else if (index<105){
                x = index%18 + 1.5;
                y = Math.floor(index/18) + 2;
            }else if (index<120){
                x = (index+3)%18 + 1.5;
                y = Math.floor((index+3)/18) + 2;
            }else{
                x = 17;
                y = 6;
            }
            let x_ = x - 8.5,
                y_ = y - 4;
            return `transform:translate(${x_*150}px,${y_*200}px)`;
        };
    })();


    /*创建125个li以及对应的初始样式*/
    (function(){
        let oStyle = document.getElementById("style"),
            styleText = "";
        fragment = document.createDocumentFragment();
        for (let i=0; i<125; i++){
            let d = data[i] || {"order":"118","name":"Uuo","mass":""};

            let oLi = document.createElement("li");
            oLi.innerHTML = `
                <p>${d.name}</p>
                <p>${d.order}</p>
                <p>${d.mass}</p>
            `;

            fragment.appendChild(oLi);

            /*提前先把所有li需要的各种样式写好*/
            styleText += `
                #list ul.random li:nth-child(${i+1}){transform:translate3d(${Math.floor(Math.random()*7000-3500)}px,${Math.floor(Math.random()*7000-3500)}px,${Math.floor(Math.random()*8000-4000)}px)}
                #list ul.Grid li:nth-child(${i+1}){${Grid(i)}}
                #list ul.Helix li:nth-child(${i+1}){${Helix(i)}}
                #list ul.Sphere li:nth-child(${i+1}){${Sphere(i)}}
                #list ul.Table li:nth-child(${i+1}){${Table(i)}}
            `;
        }
        /*将提前生成好的样式放入页面*/
        oStyle.innerHTML = styleText;

        /*将li放入页面*/
        oList.appendChild(fragment);

        //让浏览器先重绘
        oList.offsetLeft;

        //改变ul的名字，以达到改变li样式的目的
        oList.className = "Grid";
    })();

    /*鼠标事件*/
    (function(){
        /*ul的各种初始位置*/
        let rX = 0,
            rY = 0,
            tZ = -2000;

        /*鼠标的拖拽*/
        (function(){
            let sX,sY,sRotY,sRotX,lastX,lastY,XX,YY,timer,moveDate=0;
            document.addEventListener("mousedown",function (e){
                cancelAnimationFrame(timer);
                sX = lastX = e.pageX;
                sY = lastY = e.pageY;
                sRotY = rY;
                sRotX = rX;
                XX = 0;
                YY = 0;
                this.addEventListener("mousemove",move);
            });
            document.addEventListener("mouseup",function (e){
                this.removeEventListener("mousemove",move);

                /*如果 抬起时间和最后一次的move时间相差较大，那就不要惯性动画了*/
                if (new Date - moveDate > 100)return;

                /*惯性动画*/
                timer=requestAnimationFrame(m);
                function m(){
                    XX *= 0.92;
                    YY *= 0.92;

                    rY += XX*0.1;
                    rX -= YY*0.1;
                    /*改变样式*/
                    oList.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;

                    if (Math.abs(XX) <= 0.5 && Math.abs(YY) <= 0.5)return;
                    timer=requestAnimationFrame(m);
                }
            });
            function move(e){
                moveDate = new Date;
                let nX = e.pageX,
                    nY = e.pageY;

                let x_ = nX - sX,
                    y_ = nY - sY;

                /*
                * rotateY x_
                * rotateX y_
                * */
                rY = sRotY + x_*0.1; //按下时刻的角度 + 总变化角度
                rX = sRotX - y_*0.1;

                /*改变样式*/
                oList.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;


                /*求出最后两点的间距*/
                XX = nX - lastX;
                YY = nY - lastY;

                /*存储当前鼠标坐标*/
                lastX = nX;
                lastY = nY;

                /*做测试的代码*/
                /*let div = document.createElement("div");
                div.style.cssText = "width:5px;height:5px;position:fixed;top:"+nY+"px;left:"+nX+"px;background:red;";
                document.body.appendChild(div);*/
            }
        })();

        /*鼠标的滚轮*/
        (function(){

            /*火狐*/
            document.addEventListener("DOMMouseScroll",wheel);
            /*chrome*/
            document.addEventListener("mousewheel",wheel);

            function wheel(e) {
                /*
                * chrome 用 e.wheelDelta 来区分滚动方向
                *       数值是120的倍数
                *       往下拉是负值，往上推是正值
                *
                * Firefox 用 e.detail 来区分滚轮方向
                *       数值是3的倍数
                *       往下拉是正值，往上推是负值
                *
                *
                * */

                /*1的倍数 往下拉是负值 往上推是正值*/
                let d = e.detail/-3 || e.wheelDelta/120;

                /*改变 Z方向的位置*/
                tZ += d*200;
                tZ = Math.max(tZ,-7000);
                tZ = Math.min(tZ,800);

                /*样式变化*/
                oList.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
            }


        })();
    })();

    /*tab点击事件*/
    (function(){
        let oTabLi = document.querySelectorAll("#tab li");
        oTabLi.forEach(node=>{
            node.onclick = function(){
                //改变ul的名字，以达到改变li样式的目的
                oList.className = this.innerHTML;
            };
        })
    })();
})();
