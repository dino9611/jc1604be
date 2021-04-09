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
-- cart staff-id yang rata2 penjualannya paling gede 
-- cari customer yang paling sering belanja 
-- hitung berpa pembayaran yang lebih dari 7 dolar
-- menggabungkan dua column firstname dan lastname


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








