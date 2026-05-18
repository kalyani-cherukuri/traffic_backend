package com.example.traffic_backend.entity;

import com.example.traffic_backend.enums.DisputeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "disputes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "ticket_id")
    private ViolationTicket violationTicket;

    @ManyToOne
    @JoinColumn(name = "raised_by")
    private User raisedBy;

    private String disputeReason;

    @Enumerated(EnumType.STRING)
    private DisputeStatus disputeStatus;

    @ManyToOne
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    private String resolutionRemark;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;
}