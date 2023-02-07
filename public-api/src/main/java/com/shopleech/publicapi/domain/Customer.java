package com.shopleech.publicapi.domain;

import com.shopleech.base.config.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Set;

/**
 * @author Ahto Jalak
 * @since 05.02.2023
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "_customer")
public class Customer {

   @Id
   @GeneratedValue
   private Integer id;

   @ManyToOne
   private User user;

   @ManyToMany
   @JoinTable(name = "_customer_account",
           joinColumns = @JoinColumn(name = "customer_id", referencedColumnName = "id"),
           inverseJoinColumns = @JoinColumn(name = "account_id", referencedColumnName = "id")
   )
   private Set<Account> accounts;

   private String personalCode;
   private String firstName;
   private String lastName;
   private String email;
   private String phoneNumber;
   private Status status;

   private Timestamp validFrom;
   private Timestamp validTo;
   private Timestamp createdAt;
   private String createdBy;
   private Timestamp updatedAt;
   private String updatedBy;

   @OneToMany
   @JoinColumn(name="customer_id", referencedColumnName="id")
   private Set<Watchlist> watchlists;

   @OneToMany
   @JoinColumn(name="customer_id", referencedColumnName="id")
   private Set<Alarm> alarms;

   @OneToMany
   @JoinColumn(name="customer_id", referencedColumnName="id")
   private Set<Review> reviews;

   public Integer getId() {
      return id;
   }

   public void setId(Integer id) {
      this.id = id;
   }

   public String getPersonalCode() {
      return personalCode;
   }

   public String getFirstName() {
      return firstName;
   }

   public String getLastName() {
      return lastName;
   }

   public String getEmail() {
      return email;
   }

   public String getPhoneNumber() {
      return phoneNumber;
   }

   public Status getStatus() {
      return status;
   }

   public void setPersonalCode(String personalCode) {
      this.personalCode = personalCode;
   }

   public void setFirstName(String firstName) {
      this.firstName = firstName;
   }

   public void setLastName(String lastName) {
      this.lastName = lastName;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public void setPhoneNumber(String phoneNumber) {
      this.phoneNumber = phoneNumber;
   }

   public void setStatus(Status status) {
      this.status = status;
   }
}
