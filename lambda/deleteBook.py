import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Books')

def lambda_handler(event, context):
    try:
        # Get the book ID from the path parameter
        book_id = event['pathParameters']['id']
        
        # Delete the book with conditional check
        response = table.delete_item(
            Key={'id': book_id},
            ConditionExpression='attribute_exists(id)',
            ReturnValues='ALL_OLD'
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,DELETE'
            },
            'body': json.dumps({'message': 'Book deleted successfully'})
        }
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,DELETE'
                },
                'body': json.dumps({'error': 'Book not found'})
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,DELETE'
                },
                'body': json.dumps({'error': str(e)})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,DELETE'
            },
            'body': json.dumps({'error': str(e)})
        }
