-- Data for testing

INSERT INTO user values('1', 'test1', 'name1',  'add1', 'phone1', 'member', 'password1', '2021-01-01 00:00:00');

INSERT INTO user values('2', 'test2', 'name2',  'add2', 'phone2', 'member', 'password2', '2021-01-01 00:00:00');

INSERT INTO user values('3', 'test3', 'name3',  'add3', 'phone3', 'librarian', 'password3', '2021-01-01 00:00:00');

INSERT INTO user values('4', 'test4', 'name4',  'add4', 'phone4', 'librarian', 'password4', '2021-01-01 00:00:00');

INSERT INTO user values('5', 'test5', 'name5',  'add5', 'phone5', 'admin', 'password5', '2021-01-01 00:00:00');

INSERT INTO user values('6', 'test6', 'name6',  'add6', 'phone6', 'member', 'password6', '2021-01-01 00:00:00');

INSERT INTO book values('1', 'book1', 'author1', 'isbn1','publisher1', '1', '2021-01-01 00:00:00' );

INSERT INTO book values('2', 'book2', 'author2', 'isbn2','publisher2', '2', '2021-01-01 00:00:00' );

INSERT INTO book values('3', 'book3', 'author3', 'isbn3','publisher3', '0', '2021-01-01 00:00:00' );

INSERT INTO fine values('1', '1', '1', '400', 'reason1', '2021-01-01 00:00:00' );

INSERT INTO fine values('2', '2', '2', '500', 'reason2', '2021-01-01 00:00:00' );

INSERT INTO fine values('3', '3', '3', '600', 'reason3', '2021-01-01 00:00:00' );

INSERT INTO requests values('1', '1', 'req1', 'pending', '2021-01-01 00:00:00' );

INSERT INTO requests values('2', '2', 'req2', 'pending', '2021-01-01 00:00:00' );

INSERT INTO requests values('3', '3', 'req3', 'pending', '2021-01-01 00:00:00' );

INSERT INTO reserve values('1', '1', '1', 'pending', '2021-01-01 00:00:00' );

INSERT INTO reserve values('2', '2', '2', 'accepted', '2021-01-01 00:00:00' );

INSERT INTO issue values('1', '2', '2', 'borrowed', '2021-01-01 00:00:00' , '2022-01-01 00:00:00' ); 

INSERT INTO votes values('1', '2', '1', 'up', '2021-01-01 00:00:00' );

INSERT INTO votes values('2', '1', '2', 'down', '2021-01-01 00:00:00' );