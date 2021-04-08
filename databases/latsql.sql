show databases;
-- use belsql;
-- select nama2column from namatable where -> group by -> having -> order by -> limit ;
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

