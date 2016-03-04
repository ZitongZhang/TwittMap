# TwittMap
Assignment 1 for COMS E6998 Cloud Computing and Big Data

## Step 1: Creating Amazon Elasticsearch domain
1. Run the following command:
```
aws es create-elasticsearch-domain --domain-name twittmap --elasticsearch-cluster-config InstanceType=t2.micro.elastic
search,InstanceCount=1 --ebs-options EBSEnabled=true,VolumeType=gp2,VolumeSize=10
```
2. For simplicity, configure the access policy to allow open access to the domain (of course this shouldn't be used in reality)

## Step 2: Creating Index and Type
1. Run the following command. This creates a index (database) called *twittmap* and a type (table) called *tweets*.
```
curl -XPUT <Elasticsearch Endpoint>/twittmap -d '
{
    "mappings": {
        "tweets": {
            "properties": {
                "user": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "time": {
                    "type": "date"
                },
                "text": {
                    "type": "string"
                },
                "geo": {
                    "type": "geo_point"
                }
            }
        }
    }
}'
```