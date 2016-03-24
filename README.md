# TwittMap
Assignment 1 for COMS E6998 Cloud Computing and Big Data

## Step 1: Creating Amazon Elasticsearch domain
* Run the following command:
```
aws es create-elasticsearch-domain --domain-name twittmap --elasticsearch-cluster-config InstanceType=t2.micro.elastic
search,InstanceCount=1 --ebs-options EBSEnabled=true,VolumeType=gp2,VolumeSize=10
```
* For simplicity, configure the access policy to allow open access to the domain (of course this shouldn't be used in reality)

## Step 2: Creating Index and Type
* Run the following command. This creates a index (database) called *twittmap* and a type (table) called *tweets*.
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
* Create an EC2 instance
* Pull the repo from Github, `cd` into `streaming`, and run `pip install -r requirements.txt`
* Run `python streaming.py &`

## Step 4: Creating Web UI
* Create a Web UI using html and javascript to let users choose any keyword from 10 (default) via a drop-down box
* Require socket.io (version 1.2.1 or later to escape special character) to send the keyword to back-end
* Initialize Google Map using Google Maps API

## Step 5: Searching Tweets
* Using node.js express framework as back-end server to connect to elasticsearch
* Query elasticsearch according to keyword selected by users from the front-end
* Once ES responds to the server, the server then sends the response as JSON payload to the front-end

## Step 6: Visualizing Filtered Tweets
* Locate tweets and place a marker with anchor set to geometry information
* Add a listener Event for each marker. Whenver the user clicks the marker, an infowindow is created and popped out. Previous infowindow, is any, is closed

## Step 7: Deploying to Amazon Elastic Beanstalk
* Since the Linux VMs do not allow listening on port 80, it's necessary to configure the application to listen on some other port (we used 2222)
* Make an archive of all files in the directory `nodejs` (except `node_modules`), and deploy it to Amazon Elastic Beanstalk
* Configure the Elastic Load Balancer to forward traffic from port 80 to port 2222, and add corresponding rules to the security groups