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
)  ;

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
--  tampilkan film yang paling laris
 -- tampilkan data film genrenya animation 
 -- hitung berapa jumlah film berdasarkan category urutkan dari yang terkecil sampai terbesar
-- urutkan actor yang paling banyak membintangi film dari yang terbesar sampai yang terkecil
-- urutkan customer yang paling banyak belanja terus berapa total dia ngabisin duitnya, 5 teratas ,tampilkan nama , total belanja
-- cabang mana yang paling banyak menghasilkan duit , berapa duitnya


