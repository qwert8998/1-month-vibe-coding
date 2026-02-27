-- SQL Server table creation script for Order entity
CREATE TABLE [dbo].[Orders] (
    [OrderId] INT IDENTITY(1,1) PRIMARY KEY,
    [ClientId] INT NOT NULL,
    [TotalCost] DECIMAL(18,2) NOT NULL,
    [CreateBy] NVARCHAR(100) NOT NULL,
    [CreateDate] DATETIME2 NOT NULL,
    [DeliveryDate] DATETIME2 NOT NULL,
    [Canceled] BIT NOT NULL DEFAULT 0,
    [Refund] BIT NOT NULL DEFAULT 0,
    [RefundCost] DECIMAL(18,2) NULL,
    [UpdateBy] NVARCHAR(100) NULL,
    [UpdateDate] DATETIME2 NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Orders_Clients FOREIGN KEY (ClientId) REFERENCES Clients(ClientId)
);
