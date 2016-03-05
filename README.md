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

## Step 3: Streaming Tweets
1. Create an EC2 instance, and configure the security group to allow traffic on port 443
2. Pull the repo from Github, `cd` into `streaming`, and run `pip install -r requirements.txt`
3. Run `python streaming.py &`

## Step 4: Creating Web UI
1. Create a Web UI using html and javascript to let users choose any keyword from 10 (default) via a drop-down box. 
2. Require socket.io (version 1.2.1 or later to escape special character) to send the keyword to back-end .
3. Initialize Google Map using Google Maps API.

## Step 5: Searching Tweets
1. Using node.js express framework as back-end server to connect to elasticsearch.
2. Query elasticsearch according to keyword selected by users from the front-end.
3. Once ES responds to the server, the server then sends the response as JSON payload to the front-end.

## Step 6: Visualizing Filtered Tweets
1. Locate tweets and place a marker with anchor set to geometry information.
2. Add a listener Event for each marker. Whenver the user clicks the marker, an infowindow is created and popped out. Previous infowindow, is any, is closed.
