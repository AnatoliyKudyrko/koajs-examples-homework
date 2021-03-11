curl -XPOST   "127.0.0.1:8081/users" -d '{"id":0,"name":"Test"}' -H 'Content-Type: application/json'
curl -XGET    "127.0.0.1:8081/users"
curl -XPUT    "127.0.0.1:8081/users/0" -d '{"name":"Test1"}' -H 'Content-Type: application/json'
curl -XGET    "127.0.0.1:8081/users/0"
curl -XDELETE "127.0.0.1:8081/users/0"
