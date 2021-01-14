(function () {
    let ali = [];
    let fn;
    let oList = document.querySelector("#list ul");
    //创建125个li
    (function () {
        let Fragment = document.createDocumentFragment();
        for (let i = 0;i<125;i++){
            let oli = document.createElement("li");
            let d = data[i] || {"order":"1","name":"H","mass":"1.0079"};
            oli.innerHTML = `
                <p>${d.name}</p>
                <p>${d.order}</p>
                <p>${d.mass}</p>
            `;
            oli.style.transform = `translate3d(${Math.floor(Math.random()*7000-3500)}px,${Math.floor(Math.random()*7000-3500)}px,${Math.floor(Math.random()*8000-4000)}px)`;
            ali.push(oli);
            Fragment.appendChild(oli)
        }
        oList.appendChild(Fragment)
        oList.offsetLeft;//让浏览器先重绘
        //初始Grid布局
    })();

    //创建鼠标时间
    (function () {
        //获取ul的各种初始值
        let rX = 0,
            rY = 0,
            rZ = -2000;
        /*鼠标的拖拽*/
        (function () {
            let sX,sY,sRotX,sRotY,XX,YY,time,moveDate=0,lastX,lastY  ;
            document.addEventListener("mousedown",function (e) {
                cancelAnimationFrame(time);
                sX = lastX =  e.pageX;
                sY = lastY = e.pageY;
                sRotX = rX;
                sRotY = rY;
                XX = 0;
                YY = 0;
                this.addEventListener("mousemove",move);
            });
            document.addEventListener("mouseup",function (e) {
                this.removeEventListener("mousemove",move);
                /*如果 抬起时间和最后一次的move时间相差较大，那就不要惯性动画了*/
                if (new Date - moveDate > 100)return
                //惯性动画
                time = requestAnimationFrame(m);
                function m() {
                    //速度逐渐较少
                    XX *= 0.95;
                    YY *= 0.95;
                    rY += XX * 0.1;
                    rX -= YY * 0.1;
                    //改变样式
                    oList.style.transform = `translateZ(${rZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
                    if (Math.abs(XX) <= 0.5 && Math.abs(YY) <= 0.5)return;
                    time = requestAnimationFrame(m)
                }

            });
            function move (e) {
                moveDate = new Date;
                let nX = e.pageX,
                    nY = e.pageY;
                let x_ = nX - sX,
                    y_ = nY - sY;
                /*
                * rotateY x_
                * rotateX y_
                * */
                rX = sRotX - y_ * 0.1;
                rY = sRotY + x_ * 0.1;
                //改变样式
                oList.style.transform = `translateZ(${rZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
                //求出最后两个点点距离
                XX = nX - lastX;
                YY = nY - lastY;
                //存储当前鼠标的坐标
                lastX = nX;
                lastY = nY;
            }
            //滚轮事件
            (function () {
                //火狐
                document.addEventListener("DOMMouseScroll",wheel);
                //谷歌
                document.addEventListener("mousewheel",wheel)
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
                    let d = e.detail/3 || e.wheelDelta/120;
                    /*改变 Z方向的位置*/
                    rZ += d*200;
                    rZ = Math.max(rZ,-7000);
                    rZ = Math.min(rZ,800);
                    /*样式变化*/
                    oList.style.transform = `translateZ(${rZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;

                }

            })()

        })()


    })();

    //tab点击事件
    (function () {
        let oTab = document.querySelectorAll("#tab li");
        let fnd = ["Table","Sphere","Helix","Grid","Love"];
        oTab.forEach((node,i)=>{
            node.onclick = function () {
                fn[fnd[i]]();
            }
        })
    })();
    fn = {
        Grid : //创建grid布局
            function  () {
                // console.log(1);
                ali.forEach((node,index)=>{
                    //先求坐标
                    let x = index % 5; //除于5的商
                    let y = Math.floor (index % 25 / 5); //除于5的余数Math.floor
                    let z = Math.floor(index/25);
                    //与中间点求差值 中间值是（2，2）
                    let x_ = x - 2;
                    let y_ = y - 2;
                    let z_ = 2 - z;
                    //开始位置水平方向位置是240，垂直方向是320
                    //node.innerHTML = `xxx`;
                    //改变样式
                    node.style.transform = `translate3d(${x_ * 260}px,${y_ * 320}px,${z_*800}px)`;
                })
            },
        Helix : //Helix布局
            function () {
                ali.forEach((node,index)=>{
                    let deg = 360/(125/4);
                    //改变样式
                    node.style.transform = `rotateY(${index*deg}deg) translate3d(0px,${(index-62)*10}px,800px)`
                });
            },
        Sphere : //Sphere布局
            function () {
                //手动设定球体每一圈的元素个数
                let arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1];
                let len = arr.length;

                let xDeg_ = 180/(len-1);//每一层x旋转度数的增量

                ali.forEach((node,index)=>{
                    node.style.opacity = 1;
                    //通过序号求出当前li属于第几圈第几个
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

                    /*改变样式*/
                    node.style.transform = `rotateY(${yDeg}deg) rotateX(${xDeg}deg) translateZ(1000px)`
                });

            },
        Table : //Table布局
            function  (){
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
                ali.forEach((node,index)=>{
                    /*0~17的坐标*/
                    /*90~104*/
                    /*105~119*/
                    let x,y;
                    if(index<18){
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
                    }if(index>=120){
                        node.style.opacity = 0;
                    }else{
                        let x_ = x - 8.5,
                            y_ = y - 4;
                        node.style.transform = `translate(${x_*150}px,${y_*200}px)`;
                    }
                })

            },
        Love : // 创建Love布局
            function Love(){
                let xy = [
                    {x:4,y:0},
                    {x:12,y:0},
                    {x:3,y:1},
                    {x:4,y:1},
                    {x:5,y:1},
                    {x:11,y:1},
                    {x:12,y:1},
                    {x:13,y:1},
                    {x:2,y:2},
                    {x:3,y:2},
                    {x:4,y:2},
                    {x:5,y:2},
                    {x:6,y:2},
                    {x:10,y:2},
                    {x:11,y:2},
                    {x:12,y:2},
                    {x:13,y:2},
                    {x:14,y:2},
                    {x:1,y:3},
                    {x:2,y:3},
                    {x:3,y:3},
                    {x:4,y:3},
                    {x:5,y:3},
                    {x:6,y:3},
                    {x:7,y:3},
                    {x:8,y:11},
                    {x:9,y:3},
                    {x:10,y:3},
                    {x:11,y:3},
                    {x:12,y:3},
                    {x:13,y:3},
                    {x:14,y:3},
                    {x:15,y:3},
                    {x:0,y:4},
                    {x:1,y:4},
                    {x:2,y:4},
                    {x:3,y:4},
                    {x:4,y:4},
                    {x:5,y:4},
                    {x:6,y:4},
                    {x:7,y:4},
                    {x:8,y:4},
                    {x:9,y:4},
                    {x:10,y:4},
                    {x:11,y:4},
                    {x:12,y:4},
                    {x:13,y:4},
                    {x:14,y:4},
                    {x:15,y:4},
                    {x:16,y:4},
                    {x:1,y:5},
                    {x:2,y:5},
                    {x:3,y:5},
                    {x:4,y:5},
                    {x:5,y:5},
                    {x:6,y:5},
                    {x:7,y:5},
                    {x:8,y:5},
                    {x:9,y:5},
                    {x:10,y:5},
                    {x:11,y:5},
                    {x:12,y:5},
                    {x:13,y:5},
                    {x:14,y:5},
                    {x:15,y:5},
                    {x:2,y:6},
                    {x:3,y:6},
                    {x:4,y:6},
                    {x:5,y:6},
                    {x:6,y:6},
                    {x:7,y:6},
                    {x:8,y:6},
                    {x:9,y:6},
                    {x:10,y:6},
                    {x:11,y:6},
                    {x:12,y:6},
                    {x:13,y:6},
                    {x:14,y:6},
                    {x:3,y:7},
                    {x:4,y:7},
                    {x:5,y:7},
                    {x:6,y:7},
                    {x:7,y:7},
                    {x:8,y:7},
                    {x:9,y:7},
                    {x:10,y:7},
                    {x:11,y:7},
                    {x:12,y:7},
                    {x:13,y:7},
                    {x:4,y:8},
                    {x:5,y:8},
                    {x:6,y:8},
                    {x:7,y:8},
                    {x:8,y:8},
                    {x:9,y:8},
                    {x:10,y:8},
                    {x:11,y:8},
                    {x:12,y:8},
                    {x:5,y:9},
                    {x:6,y:9},
                    {x:7,y:9},
                    {x:8,y:9},
                    {x:9,y:9},
                    {x:10,y:9},
                    {x:11,y:9},
                    {x:6,y:10},
                    {x:7,y:10},
                    {x:8,y:10},
                    {x:9,y:10},
                    {x:10,y:10},
                    {x:7,y:11},
                    {x:8,y:11},
                    {x:9,y:11},
                    {x:8,y:12},
                    {x:10,y:10},
                    {x:7,y:11},
                    {x:7,y:5},
                    {x:9,y:5},
                    {x:6,y:6},
                    {x:8,y:6},
                    {x:10,y:6},
                    {x:7,y:7},
                    {x:9,y:7},
                    {x:8,y:8},
                    {x:8,y:12}
                ];
                ali.forEach((node,index)=>{
                    let x,y;
                    if(index<125){
                        x = xy[index].x;
                        y = xy[index].y;
                    }
                    let x_ = x - 9,
                        y_ = y - 7;
                    node.style.transform = `translate(${x_*150}px,${y_*200}px)`;
                });
            }
    }




})();