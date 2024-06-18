﻿// <auto-generated />
using FFXIV_RaidLootAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FFXIV_RaidLootAPI.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20240618002116_Added User table")]
    partial class AddedUsertable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("FFXIV_RaidLootAPI.Models.Gear", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("EtroGearId")
                        .HasColumnType("int");

                    b.Property<int>("GearCategory")
                        .HasColumnType("int");

                    b.Property<int>("GearLevel")
                        .HasColumnType("int");

                    b.Property<int>("GearStage")
                        .HasColumnType("int");

                    b.Property<int>("GearType")
                        .HasColumnType("int");

                    b.Property<int>("GearWeaponCategory")
                        .HasColumnType("int");

                    b.Property<string>("IconPath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Gears");
                });

            modelBuilder.Entity("FFXIV_RaidLootAPI.Models.Players", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("BisBodyGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisBraceletsGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisEarringsGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisFeetGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisHandsGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisHeadGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisLeftRingGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisLegsGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisNecklaceGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisRightRingGearId")
                        .HasColumnType("int");

                    b.Property<int>("BisWeaponGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurBodyGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurBraceletsGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurEarringsGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurFeetGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurHandsGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurHeadGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurLeftRingGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurLegsGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurNecklaceGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurRightRingGearId")
                        .HasColumnType("int");

                    b.Property<int>("CurWeaponGearId")
                        .HasColumnType("int");

                    b.Property<string>("EtroBiS")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("GearScore")
                        .HasColumnType("int");

                    b.Property<int>("Job")
                        .HasColumnType("int");

                    b.Property<bool>("Locked")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("staticId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Players");
                });

            modelBuilder.Entity("FFXIV_RaidLootAPI.Models.Raid", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Raids");
                });

            modelBuilder.Entity("FFXIV_RaidLootAPI.Models.Static", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<decimal>("GearScoreA")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal>("GearScoreB")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal>("GearScoreC")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UUID")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Statics");
                });
#pragma warning restore 612, 618
        }
    }
}
