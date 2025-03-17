import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Books')

def lambda_handler(event, context):
    try:
        # Get the book ID from the path parameter
        book_id = event['pathParameters']['id']
        
        # Parse the incoming JSON data
        if 'body' in event:
            book_data = json.loads(event['body'])
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,PUT'
                },
                'body': json.dumps({'error': 'No book data provided'})
            }
        
        # Check if the book exists
        response = table.get_item(Key={'id': book_id})
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,PUT'
                },
                'body': json.dumps({'error': 'Book not found'})
            }
        
        # Prepare update expression
        update_expression = "set "
        expression_attribute_values = {}
        expression_attribute_names = {}
        
        # Update title if provided
        if 'title' in book_data:
            update_expression += "#title = :title, "
            expression_attribute_values[':title'] = book_data['title']
            expression_attribute_names['#title'] = 'title'
        
        # Update author if provided
        if 'author' in book_data:
            update_expression += "#author = :author, "
            expression_attribute_values[':author'] = book_data['author']
            expression_attribute_names['#author'] = 'author'
        
        # Update year if provided
        if 'year' in book_data:
            update_expression += "#year = :year, "
            expression_attribute_values[':year'] = book_data['year']
            expression_attribute_names['#year'] = 'year'
        
        # Update genre if provided
        if 'genre' in book_data:
            update_expression += "#genre = :genre, "
            expression_attribute_values[':genre'] = book_data['genre']
            expression_attribute_names['#genre'] = 'genre'
        
        # Remove trailing comma and space
        update_expression = update_expression.rstrip(', ')
        
        # Check if there are attributes to update
        if not expression_attribute_values:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,PUT'
                },
                'body': json.dumps({'error': 'No fields to update'})
            }
        
        # Update item in DynamoDB with conditional expression
        # This ensures we're updating the correct version of the book
        response = table.update_item(
            Key={'id': book_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names,
            ConditionExpression='attribute_exists(id)',
            ReturnValues='ALL_NEW'
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT'
            },
            'body': json.dumps({'message': 'Book updated successfully', 'book': response.get('Attributes')})
        }
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,PUT'
                },
                'body': json.dumps({'error': 'Book not found'})
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,PUT'
                },
                'body': json.dumps({'error': str(e)})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT'
            },
            'body': json.dumps({'error': str(e)})
        }