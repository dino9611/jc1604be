show databases;
-- use belsql;
-- select nama2column from namatable -> join where -> group by -> having -> order by -> limit ;
-- select count* from users where kota='jakarta' order by username desc;

-- select distinct first_name from actor 
 
-- select * from film where rental_duration not in (6,5) order by rental_duration ; 

-- film yang huruf a-nya didepan
select * from film where title like 'a%' ; 

select count(*) from film where title like 'a%' ;
select avg(replacement_cost) as rata_rata_cost from film ; 
select sum(replacement_cost) as total_replacement_cost from film  ; 
select max(replacement_cost) as total_replacement_cost from film  ;
select min(replacement_cost) as total_replacement_cost from film  ;  


select avg(replacement_cost) as ratarata_cost,rating  
from film  group by rating  
having ratarata_cost >20 
order by ratarata_cost desc limit 1 ; 

select * from payment;
-- cari custumer id yang belanja paling banyak sampe terkecil urutkan
select sum(amount) as belanja,customer_id 
from payment group by customer_id order by belanja desc limit 1;
-- cart staff-id yang rata2 penjualannya paling gede 
select sum(amount) as jual,staff_id 
from payment group by staff_id order by jual desc limit 1;
-- cari customer yang paling sering belanja
select count(*) as total_belanja,customer_id 
from payment group by customer_id order by total_belanja desc limit 1;
-- hitung berpa pembayaran yang lebih dari 7 dolar
select count(*) as jumlah_pembyaran
from payment where amount >7;
-- menggabungkan dua column firstname dan lastname
select concat(first_name,' ',last_name) as fullname from actor;
 



use belsql;
select * from products;
select * from users;
select * from send_address;
select * from sellers;
select * from transactions;
-- join/inner join 
select u.*,s.nama as namatoko from users u 
	join sellers s on u.id=s.idsellers  ;
    -- jumlah transaksi per user
select count(*) as jumlah_transaksi,u.username 
from transactions t 
join users u on t.userId=u.id 
group by t.userId ;

select count(*) as jumlah_transaksi,userId from transactions group by userId ; 

select *
from transactions t 
right join users u on t.userId=u.id ;    
    
    
-- left join
select u.*,s.nama as namatoko from users u  
	left join sellers s on u.id=s.idsellers  ;
-- users dikiri sellers dikanan
select *  from users u  
	left join sellers s on u.id=s.idsellers  ;
-- users yang bukan sellers
select *  from users u  
	left join sellers s on u.id=s.idsellers where s.nama is null ;
-- sellers dikiri users dikanan
select * from sellers s  
	left join users u on u.id=s.idsellers  ;

select u.*,s.nama as namatoko from sellers s  
	left join users u on u.id=s.idsellers  ;

-- right join
select u.*,s.nama as namatoko from users u  
	right join sellers s on u.id=s.idsellers  ;
-- users dikiri sellers dikanan        
select * from users u  
	right join sellers s on u.id=s.idsellers  ;
-- sellers dikiri users dikanan
select *  from sellers s
	right join users u on u.id=s.idsellers  ;


-- many to many
select td.*,p.name,p.description,t.status from transactions_details td 
join products p on td.idproducts = p.id
join transactions t on td.idtransaction= t.id;  


select sum(td.price*td.qty) as total_price,td.idtransaction,t.status
from transactions_details td 
join products p on td.idproducts = p.id
join transactions t on td.idtransaction= t.id 
group by td.idtransaction;  

-- subqueries

select max(price) as price_max from (select td.*,p.name,p.description,t.status from transactions_details td 
join products p on td.idproducts = p.id
join transactions t on td.idtransaction= t.id) as tabgabung;

select td.* from transactions_details td 
join products p on td.idproducts = p.id
join transactions t on td.idtransaction= t.id where t.status= 'onCart';  


select * from transactions_details 
where  idtransaction in (
	select id  from transactions where status = 'onCart'
) ;

select * 
from transactions_details 
where price > (select avg(price) as rata_rata from transactions_details) ;


-- views
-- panggil view
select * from maxprice;

-- gunainsakila
use sakila;
-- coba bikin list tiap actor peranin film apa saja
select 
concat(a.first_name,' ',a.last_name) as fullname, 
group_concat( title order by title separator ' ; ') as list_film
from film_actor fa 
join actor a on fa.actor_id = a.actor_id 
join film f on fa.film_id=f.film_id 
group by fa.actor_id ;
-- list actor untuk film dengan id=1
select
f.title,
group_concat( concat(a.first_name, ' ', a.last_name ) order by a.first_name,a.last_name  separator ';') as list_actor
from film_actor fa 
join actor a on fa.actor_id = a.actor_id 
join film f on fa.film_id=f.film_id 
where f.film_id =1
group by fa.film_id  ;

-- ambil data film apa saja yang dimainkan penelope guiness
select fa.film_id,f.title from film_actor fa 
join film f on fa.film_id = f.film_id
where actor_id=(
	select actor_id 
		from actor 
		where first_name = 'penelope' and last_name="guiness");
 -- tampilkan data film genrenya animation 
 select f.title from film_category fc  
 join film f on f.film_id = fc.film_id
	where category_id = 
		(select category_id from category where name='Animation');
 -- hitung berapa jumlah film berdasarkan category urutkan dari yang terkecil sampai terbesar
 select count(*) as jumlah_filmperCategory,c.name 
 from film_category fc 
 join category c 
 on fc.category_id = c.category_id
 group by c.category_id 
 order by jumlah_filmperCategory;
-- urutkan actor yang paling banyak membintangi film dari yang terbesar sampai yang terkecil
select count(*) as jumlah_film,
concat(a.first_name,' ',a.last_name) as full_name
from film_actor fa 
join actor a on fa.actor_id = a.actor_id
group by fa.actor_id 
order by jumlah_film desc
;


--  tampilkan film yang paling laris
select i.film_id,sum(amount) as jumlah_pendapatan, f.title from payment p 
join rental r on p.rental_id=r.rental_id
join inventory i on r.inventory_id=i.inventory_id
join film f on i.film_id=f.film_id
group by i.film_id
order by jumlah_pendapatan desc
limit 1
;
-- cabang mana yang paling banyak menghasilkan duit , berapa duitnya
select st.store_id,s.staff_id,a.address,
sum(amount) as penjualan,
concat(s.first_name,' ',s.last_name) as full_name 
from payment p 
join staff s on p.staff_id=s.staff_id 
join store st on s.store_id= st.store_id
join address a on st.address_id = a.address_id
group by s.store_id
order by penjualan desc
limit 1
;
-- urutkan customer yang paling banyak belanja terus berapa total dia ngabisin duitnya, 5 teratas ,tampilkan nama , total belanja
select p.customer_id,
concat(c.first_name, ' ', c.last_name) as full_name,
count(*) as count_belanja,
sum(amount) as total_belanja 
from payment p 
join customer c on p.customer_id = c.customer_id
group by customer_id
order by count_belanja desc , total_belanja desc
limit 5;





select * from mysql.user;

-- ALTER USER 'dino9611'@'%' IDENTIFIED WITH mysql_native_password BY 'yourpassword';


-- gunain classicmodels
use classicmodels;

-- cari pegawai yang ngelapor ke vp sales

select * from employees where reportsTo=
(select employeeNumber from employees where jobtitle = 'vP sales');
-- berapa jumlah uang yang hilang karena order di cancel

select sum(od.priceEach * od.quantityOrdered) as TotalperEach from 
orderdetails od join orders o on od.orderNumber = o.orderNumber
 where status='cancelled' 

















