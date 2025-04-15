import json
import boto3
import uuid
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Books')

def lambda_handler(event, context):
    try:
        # Parse the incoming JSON data
        if 'body' in event:
            book_data = json.loads(event['body'])
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({'error': 'No book data provided'})
            }
        
        # Generate a unique ID for the book
        book_id = str(uuid.uuid4())
        
        # Ensure required fields are present
        if 'title' not in book_data or 'author' not in book_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({'error': 'Title and author are required'})
            }
        
        # Add the book to DynamoDB
        book_item = {
            'id': book_id,
            'title': book_data['title'],
            'author': book_data['author']
        }
        
        # Add optional fields if present
        if 'year' in book_data:
            book_item['year'] = book_data['year']
        
        if 'genre' in book_data:
            book_item['genre'] = book_data['genre']
        
        # Save to DynamoDB
        table.put_item(Item=book_item)
        
        return {
            'statusCode': 201,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({'message': 'Book added successfully', 'id': book_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({'error': str(e)})
        }