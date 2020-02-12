## 创表
- 本次一共7张表，用户信息表(users)、商品表(goods)、商品分类表(goodtypes)、购物车表(cars)、地址表(address)、订单表(orders)、评论表(commits)

### users

~~~java
create table `users` (
	`userName` varchar (300), // 用户名
	`userId` varchar (300), // 用户id
	`password` varchar (300), // 密码
	`phone` varchar (300), // 手机号
	`avater` varchar (300), // 头像
	`userGrade` int (10) // 等级 默认值为0 ，老板为 1
); 
~~~

### goods

~~~java
create table `goods` (
	`goodName` varchar (300), // 商品名字
	`goodId` varchar (300), // 商品id
	`goodPrice` int (255), // 商品价格
	`goodOldPrice` varchar (600), //商品原始价格
	`goodSell` int (255), // 销量
	`goodNum` int (255), // 库存
	`goodPic` varchar (3000), // 图片
	`goodTypeId` varchar (300) // 商品分类id
); 
~~~

### goodtypes

~~~java
create table `goodtypes` (
	`typeId` varchar (300), // 分类id
	`typeText` varchar (300), // 分类名称
	`typePic` varchar (300) // 分类图片
); 
~~~

### cars

~~~java
create table `cars` (
	`carId` varchar (300), // 购物车唯一id
	`carGoodId` varchar (300), // 商品id
	`carUserId` varchar (300), // 用户id
	`carNum` int (255), // 加入购物车的数量
	`carSelect` tinyint (1) // 一个标识
);
~~~

### address

~~~Java
create table `address` (
	`aId` varchar (300), // 地址id
	`aUserId` varchar (300), // 用户id
	`aName` varchar (300), // 联系人姓名
	`aPhone` varchar (300), // 联系电话
	`address` varchar (300), // 地址
	`aInit` tinyint (100) // 是否为默认地址 默认值为 0
);
~~~

### orders

~~~java
create table `orders` (
	`orderId` varchar (765), // 订单id
	`orderUserId` varchar (765), // 用户id
	`commitFlag` tinyint (1), // 是否评论 默认值为 0
	`finishFlag` tinyint (1), // 订单是否完成 默认值为 0
    `sendGoodFlag` tinyint (1), // 是否发货 默认值为 0
	`postSellFlag` tinyint (1), // 是否退款售后 默认值为 0
	`oGoodLetter` varchar (300), // 备注
	`orderName` varchar (300), // 收货联系人姓名
	`orderPhone` varchar (300), // 收货联系人手机号
	`orderAddress` varchar (300), // 收货地址
	`oGoodId` varchar (300), // 商品id
	`oGoodName` varchar (300), // 商品名称
	`oGoodPic` varchar (3000), // 商品图片
	`oGoodPrice` varchar (300), // 商品价格
	`oGoodNum` varchar (300), // 购买商品数量
	`orderTime` varchar (300) // 下单时间
);
~~~

### commits

~~~java
create table `commits` (
	`commitId` varchar (300), // 评论id
	`commit` varchar (765), // 评论内容
	`commitTime` varchar (765), // 评论时间
	`commitGoodId` varchar (765), // 评论商品id
	`commitUserId` varchar (765), // 评论用户id
	`commitPic` varchar (765), // 评论发表的图片
	`commitGrade` int (255), // 评分
	`commitOrderId` varchar (300) // 订单id
); 
~~~



