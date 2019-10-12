BEGIN TRANSACTION

INSERT INTO [dbo].[TodoItem]([Id],[CreatedAt],[ModifiedAt],[Title],[Description],[IsCompleted]) VALUES
    ('da6b10e4-0949-4d00-ae8d-014167f19b3e', '2019-02-01 13:03:45', '2019-02-01 13:03:48', 'Sample - Fix deployment', 'Deployment of cooking application need a little love', 0),
    ('aa789bfa-11ff-4815-9a61-213113df6947', '2019-02-02 09:06:23', '2019-02-02 10:13:10', 'Sample - Go to gym', 'You need to spend more time moving', 0),
    ('97ad8065-e69a-4fbc-ad14-a17dad3f946a', '2019-02-03 10:03:28', '2019-02-03 01:10:20', 'Sample - Make dinner reservation', 'Time to go out', 0),
    ('1bdcbe54-3cac-4674-a351-d4b3996a757d', '2019-02-04 09:06:16', '2019-02-04 01:21:11', 'Sample - Grocery shopping', 'Buy some apples, oranges and bread', 0),
    ('c742ec4c-b0a2-454a-abd8-a0115f23795f', '2019-02-05 07:50:37', '2019-02-05 11:33:12', 'Sample - Laundry', 'It''s that time of the week, again', 0),
    ('4e687885-07b4-4655-8937-339d639fedb6', '2019-02-06 09:06:33', '2019-02-06 23:17:13', 'Sample - E-mail mom', 'you need to reply to mom', 0),
    ('0fe93a68-c327-495b-85b3-b4694492c3cc', '2019-02-07 09:07:37', '2019-02-07 21:12:14', 'Sample - Follow up with Christian', 'Make sure that you are up to date', 0),
    ('5d0e736f-e9fd-4d4a-a83f-533f1ce6f677', '2019-02-08 09:08:28', '2019-02-08 16:04:15', 'Sample - Clean up room', 'You know that is needed', 0),
    ('0d786ff4-c96d-42a0-ad44-04f9dbebb6c6', '2019-02-09 09:09:21', '2019-02-09 22:09:16', 'Sample - Do homework', 'If you want to learn German you need to practice', 0),
    ('451522e3-e4df-4a26-84e7-ab794579b8c4', '2019-02-10 09:10:12', '2019-02-10 17:19:27', 'Sample - Renew driver licence', 'this is highly important', 0),
    ('cf4895f5-a3d4-47a6-9ffd-1850345ce92b', '2019-01-02 09:11:16', '2019-02-03 18:23:18', 'Sample - Piano leassons', 'Monday and Friday', 0),
    ('10c67c54-dea1-46ac-8d7d-1a51fef923c2', '2019-01-22 16:09:21', '2019-01-27 03:52:29', 'Sample - Search for a new laptop', 'i5, 1TB SSD and 16GB of RAM', 0),
    ('9b1f603b-9027-4add-84df-e6df875e8852', '2019-02-02 23:07:23', '2019-02-04 11:01:44', 'Sample - Completed item 1', 'Description of completed item 1', 1),
    ('9554800e-4bf7-47d0-bca7-c11e94107143', '2019-02-03 23:07:24', '2019-02-05 12:02:24', 'Sample - Completed item 2', 'Description of completed item 2', 1),
    ('4ad1bc17-a049-4e73-9bbe-c727366758c8', '2019-02-04 13:07:25', '2019-02-06 13:03:14', 'Sample - Completed item 3', 'Description of completed item 3', 1),
    ('8d99ce0e-ec8a-4639-b645-028c04f29742', '2019-02-05 23:07:26', '2019-02-07 14:04:04', 'Sample - Completed item 4', 'Description of completed item 4', 1),
    ('20b971ff-69bd-4656-afbc-a192a3ce0a39', '2019-02-06 11:07:27', '2019-02-08 15:05:15', 'Sample - Completed item 5', 'Description of completed item 5', 1),
    ('eac0c551-aace-45e6-af87-75d285f6cbfb', '2019-02-07 09:09:28', '2019-02-09 16:06:47', 'Sample - Completed item 6', 'Description of completed item 6', 1),
    ('0ac8c6d2-85a4-4ad9-a7f8-7b2ab0d88cbc', '2019-02-08 08:06:29', '2019-02-10 17:07:32', 'Sample - Completed item 7', 'Description of completed item 7', 1),
    ('3a261980-6f20-49e2-9c22-cee07f91767f', '2019-02-09 08:10:30', '2019-02-11 18:08:15', 'Sample - Completed item 8', 'Description of completed item 8', 1),
    ('f60d5349-21ac-4ae7-9bfc-3b3e78a6ec60', '2019-02-10 22:07:31', '2019-02-12 19:09:07', 'Sample - Completed item 9', 'Description of completed item 9', 1),
    ('3922c91d-0fa0-4037-8485-8a3d1890ad4a', '2018-05-21 20:21:17', '2018-12-04 20:32:01', 'Sample - Item with no description', NULL, 0),
    ('06f8af5f-53a9-4726-bbe8-453444d35317', '2018-11-06 18:12:13', '2019-01-14 22:42:09', 'Sample - Item with no description and completed', NULL, 1);


DECLARE @I INTEGER;
SET @I = 0
WHILE (@I < $1000)
BEGIN
    SET @I = @I + 1
    INSERT INTO [dbo].[TodoItem]([Id],[CreatedAt],[ModifiedAt],[Title],[Description],[IsCompleted]) VALUES
        (NEWID(), GETUTCDATE(), GETUTCDATE(), CONCAT('Sample - Bulk ', CONVERT(NVARCHAR, @I)), 'No description for bulk item', IIF(@I % 2 = 0,0,1));
END
COMMIT
